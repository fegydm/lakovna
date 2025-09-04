// File: common/configs/project.config.ts
// Last change: Created the final aggregator config from all partial configs.

import { ACCESS_ROLES, ZODIAC_SIGNS } from './01-constants.config';
import { PROJECT_COLOR_CONFIG } from './02-colors.config';
import { APP_CONFIG } from './03-app.config';
import { UI_CONFIG } from './04-ui.config';
import { I18N_CONFIG } from './05-i18n.config';
import { DATA_CONFIG } from './06-data.config';
import type { ZodiacSign } from '../types/project.types';

export const PROJECT_CONFIG = {
  app: APP_CONFIG,
  colors: PROJECT_COLOR_CONFIG,
  ui: UI_CONFIG,
  i18n: I18N_CONFIG,
  data: DATA_CONFIG,

  accessRoleHierarchy: {
    [ACCESS_ROLES.SUPERADMIN]: 100,
    [ACCESS_ROLES.DEVELOPER]: 90,
    [ACCESS_ROLES.OWNER]: 80,
    [ACCESS_ROLES.MANAGER]: 60,
    [ACCESS_ROLES.COORDINATOR]: 50,
    [ACCESS_ROLES.WORKER]: 40,
    [ACCESS_ROLES.PARTNER]: 30,
    [ACCESS_ROLES.VIEWER]: 10,
  },

  businessRoles: [
    'shop_owner',
    'painter',
    'service_tech',
    'advisor',
    'estimator',
    'detailer',
    'wrapper',
  ] as const,

  zodiac: {
    displayNames: {
      [ZODIAC_SIGNS.ARIES]: "Aries",
      [ZODIAC_SIGNS.TAURUS]: "Taurus",
      [ZODIAC_SIGNS.GEMINI]: "Gemini",
      [ZODIAC_SIGNS.CANCER]: "Cancer",
      [ZODIAC_SIGNS.LEO]: "Leo",
      [ZODIAC_SIGNS.VIRGO]: "Virgo",
      [ZODIAC_SIGNS.LIBRA]: "Libra",
      [ZODIAC_SIGNS.SCORPIO]: "Scorpio",
      [ZODIAC_SIGNS.SAGITTARIUS]: "Sagittarius",
      [ZODIAC_SIGNS.CAPRICORN]: "Capricorn",
      [ZODIAC_SIGNS.AQUARIUS]: "Aquarius",
      [ZODIAC_SIGNS.PISCES]: "Pisces",
    } as Record<ZodiacSign, string>,

    dateRanges: {
      [ZODIAC_SIGNS.ARIES]: { start: "03-21", end: "04-19" },
      [ZODIAC_SIGNS.TAURUS]: { start: "04-20", end: "05-20" },
      [ZODIAC_SIGNS.GEMINI]: { start: "05-21", end: "06-20" },
      [ZODIAC_SIGNS.CANCER]: { start: "06-21", end: "07-22" },
      [ZODIAC_SIGNS.LEO]: { start: "07-23", end: "08-22" },
      [ZODIAC_SIGNS.VIRGO]: { start: "08-23", end: "09-22" },
      [ZODIAC_SIGNS.LIBRA]: { start: "09-23", end: "10-22" },
      [ZODIAC_SIGNS.SCORPIO]: { start: "10-23", end: "11-21" },
      [ZODIAC_SIGNS.SAGITTARIUS]: { start: "11-22", end: "12-21" },
      [ZODIAC_SIGNS.CAPRICORN]: { start: "12-22", end: "01-19" },
      [ZODIAC_SIGNS.AQUARIUS]: { start: "01-20", end: "02-18" },
      [ZODIAC_SIGNS.PISCES]: { start: "02-19", end: "03-20" },
    } as Record<ZodiacSign, { start: string; end: string }>,
  }
};