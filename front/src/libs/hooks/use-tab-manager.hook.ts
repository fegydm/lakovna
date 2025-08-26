// File: lakovna/front/src/libs/hooks/use-tab-manager.hook.ts
// Last change: Fixed TypeScript error by explicitly casting setInterval's return type to number.

import { useState, useEffect, useRef, useCallback } from 'react';

interface TabInfo {
  tabId: string;
  timestamp: number;
  url: string;
}

export const useTabManager = () => {
  const [activeTabCount, setActiveTabCount] = useState(1);
  const [activeTabs, setActiveTabs] = useState<TabInfo[]>([]);
  const tabId = useRef<string>('');
  const bcRef = useRef<BroadcastChannel | null>(null);
  const heartbeatInterval = useRef<number | null>(null);

  const updateTabCountFromState = useCallback((tabs: TabInfo[]) => {
    const currentTime = Date.now();
    const validTabs = tabs.filter(tab => 
      currentTime - tab.timestamp < 10000
    );
    const totalCount = validTabs.length + 1;
    
    setActiveTabCount(totalCount);
    
    return validTabs;
  }, []);

  useEffect(() => {
    tabId.current = `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    bcRef.current = new BroadcastChannel('sendeliver_tabs');
    
    const handleMessage = (event: MessageEvent) => {
      const { type, data } = event.data;
      if (data.tabId === tabId.current) return;

      switch (type) {
        case 'TAB_PING':
          bcRef.current?.postMessage({
            type: 'TAB_PONG',
            data: { tabId: tabId.current, timestamp: Date.now(), url: window.location.href }
          });
          break;
        case 'TAB_PONG':
          setActiveTabs(prev => {
            const otherTabs = prev.filter(tab => tab.tabId !== data.tabId);
            return [...otherTabs, data];
          });
          break;
        case 'TAB_CLOSING':
          setActiveTabs(prev => prev.filter(tab => tab.tabId !== data.tabId));
          break;
        case 'LOGOUT_ALL_TABS':
          window.dispatchEvent(new CustomEvent('forceLogout'));
          break;
      }
    };
    
    bcRef.current.onmessage = handleMessage;
    
    const pingOtherTabs = () => {
      bcRef.current?.postMessage({
        type: 'TAB_PING',
        data: { tabId: tabId.current, timestamp: Date.now(), url: window.location.href }
      });
    };
    
    setTimeout(pingOtherTabs, 100);
    
    heartbeatInterval.current = window.setInterval(() => {
      setActiveTabs(prev => updateTabCountFromState(prev));
      pingOtherTabs();
    }, 5000) as unknown as number;
    
    const handleBeforeUnload = () => {
      bcRef.current?.postMessage({
        type: 'TAB_CLOSING',
        data: { tabId: tabId.current }
      });
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      if (heartbeatInterval.current) {
        clearInterval(heartbeatInterval.current);
      }
      handleBeforeUnload();
      bcRef.current?.close();
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [updateTabCountFromState]);

  useEffect(() => {
    updateTabCountFromState(activeTabs);
  }, [activeTabs, updateTabCountFromState]);
  
  const logoutAllTabs = () => {
    bcRef.current?.postMessage({
      type: 'LOGOUT_ALL_TABS',
      data: { fromTab: tabId.current }
    });
  };
  
  return {
    activeTabCount,
    logoutAllTabs,
  };
};