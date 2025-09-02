// File: common/utils/front/cookie.utils.ts
// Last change: Created centralized cookie management utilities

export interface CookieOptions {
  expires?: Date;
  maxAge?: number;
  domain?: string;
  path?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  httpOnly?: boolean;
}

export const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') {
    return null;
  }
  
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
};

export const setCookie = (
  name: string, 
  value: string, 
  daysOrOptions?: number | CookieOptions
): void => {
  if (typeof document === 'undefined') {
    return;
  }

  let options: CookieOptions = {};
  
  if (typeof daysOrOptions === 'number') {
    const expires = new Date();
    expires.setTime(expires.getTime() + daysOrOptions * 24 * 60 * 60 * 1000);
    options.expires = expires;
  } else if (daysOrOptions) {
    options = daysOrOptions;
  }

  let cookieString = `${name}=${encodeURIComponent(value)}`;

  if (options.expires) {
    cookieString += `; expires=${options.expires.toUTCString()}`;
  }

  if (options.maxAge) {
    cookieString += `; max-age=${options.maxAge}`;
  }

  if (options.domain) {
    cookieString += `; domain=${options.domain}`;
  }

  if (options.path !== undefined) {
    cookieString += `; path=${options.path}`;
  } else {
    cookieString += '; path=/';
  }

  if (options.secure) {
    cookieString += '; secure';
  }

  if (options.sameSite) {
    cookieString += `; samesite=${options.sameSite}`;
  }

  if (options.httpOnly) {
    cookieString += '; httponly';
  }

  document.cookie = cookieString;
};

export const deleteCookie = (name: string, path: string = '/'): void => {
  setCookie(name, '', {
    expires: new Date(0),
    path,
  });
};

export const getAllCookies = (): Record<string, string> => {
  if (typeof document === 'undefined') {
    return {};
  }

  const cookies: Record<string, string> = {};
  
  if (document.cookie) {
    const pairs = document.cookie.split(';');
    
    for (const pair of pairs) {
      const [name, ...rest] = pair.trim().split('=');
      if (name && rest.length > 0) {
        cookies[name] = decodeURIComponent(rest.join('='));
      }
    }
  }
  
  return cookies;
};

export const hasCookie = (name: string): boolean => {
  return getCookie(name) !== null;
};

export const cookieExists = (name: string): boolean => {
  return hasCookie(name);
};

export const setCookieWithDefaults = (
  name: string,
  value: string,
  days: number = 30
): void => {
  setCookie(name, value, {
    expires: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
    path: '/',
    sameSite: 'lax',
    secure: window.location.protocol === 'https:',
  });
};