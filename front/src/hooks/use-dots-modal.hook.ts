// File: front/src/hooks/use-dots-modal.hook.ts
// Handles selection logic for DotsModal (categories + statuses)

import { useMemo } from "react";
import type { DotCategory } from "common/types/dot-system.types";
import type { AuthStatus } from "common/types/auth backup.types";
import { DOT_CATEGORIES, DOT_STATUSES } from "common/configs/_backaup/dot-system.config";

type DotsArray = string[];

const extractSelection = <T extends string>(dots: DotsArray, keys: T[]): T | null => {
  const activeIndex = dots.findIndex((color) => color !== "#d1d5db"); // fallback gray
  return activeIndex !== -1 ? keys[activeIndex] : null;
};

interface UseDotsModalProps {
  initialTopDots: DotsArray;
  initialBottomDots: DotsArray;
  onSelectionChange: (top: DotCategory | null, bottom: AuthStatus | null) => Promise<void>;
}

export const useDotsModal = ({
  initialTopDots,
  initialBottomDots,
  onSelectionChange,
}: UseDotsModalProps) => {
  // selected values
  const selectedTop = useMemo(
    () => extractSelection(initialTopDots, Object.keys(DOT_CATEGORIES) as DotCategory[]),
    [initialTopDots]
  );

  const selectedBottom = useMemo(
    () => extractSelection(initialBottomDots, Object.keys(DOT_STATUSES) as AuthStatus[]),
    [initialBottomDots]
  );

  // options for modal UI
  const roleOptions = useMemo(
    () =>
      Object.entries(DOT_CATEGORIES).map(([id, cfg]) => ({
        id: id as DotCategory,
        label: cfg.label,
      })),
    []
  );

  const statusOptions = useMemo(
    () =>
      Object.entries(DOT_STATUSES).map(([id, cfg]) => ({
        id: id as AuthStatus,
        label: cfg.label,
      })),
    []
  );

  // handle user clicking on a dot
  const handleSelection = (id: string, isTopRow: boolean) => {
    if (isTopRow) {
      onSelectionChange(id as DotCategory, null);
    } else {
      onSelectionChange(null, id as AuthStatus);
    }
  };

  // get color for dot
  const getDotColor = (id: string, isSelected: boolean, isTopRow: boolean) => {
    if (!isSelected) return "#d1d5db"; // inactive gray
    return isTopRow
      ? DOT_CATEGORIES[id as DotCategory].color
      : DOT_STATUSES[id as AuthStatus].color;
  };

  return {
    selectedTop,
    selectedBottom,
    roleOptions,
    statusOptions,
    handleSelection,
    getDotColor,
  };
};
