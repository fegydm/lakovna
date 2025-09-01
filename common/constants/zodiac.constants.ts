// File: common/constants/zodiac.constants.ts
// Last change: Created centralized zodiac signs constants

export const ZODIAC_SIGNS = [
  "aries",
  "taurus", 
  "gemini",
  "cancer",
  "leo",
  "virgo",
  "libra",
  "scorpio",
  "sagittarius",
  "capricorn",
  "aquarius",
  "pisces",
] as const;

export type ZodiacSign = typeof ZODIAC_SIGNS[number];

export const ZODIAC_DISPLAY_NAMES: Record<ZodiacSign, string> = {
  aries: "Aries",
  taurus: "Taurus", 
  gemini: "Gemini",
  cancer: "Cancer",
  leo: "Leo",
  virgo: "Virgo",
  libra: "Libra",
  scorpio: "Scorpio",
  sagittarius: "Sagittarius",
  capricorn: "Capricorn",
  aquarius: "Aquarius",
  pisces: "Pisces",
};

export const ZODIAC_DATE_RANGES: Record<ZodiacSign, { start: string; end: string }> = {
  aries: { start: "03-21", end: "04-19" },
  taurus: { start: "04-20", end: "05-20" },
  gemini: { start: "05-21", end: "06-20" },
  cancer: { start: "06-21", end: "07-22" },
  leo: { start: "07-23", end: "08-22" },
  virgo: { start: "08-23", end: "09-22" },
  libra: { start: "09-23", end: "10-22" },
  scorpio: { start: "10-23", end: "11-21" },
  sagittarius: { start: "11-22", end: "12-21" },
  capricorn: { start: "12-22", end: "01-19" },
  aquarius: { start: "01-20", end: "02-18" },
  pisces: { start: "02-19", end: "03-20" },
};

export const getZodiacByBirthDate = (birthDate: Date): ZodiacSign => {
  const month = String(birthDate.getMonth() + 1).padStart(2, '0');
  const day = String(birthDate.getDate()).padStart(2, '0');
  const dateString = `${month}-${day}`;
  
  for (const [sign, range] of Object.entries(ZODIAC_DATE_RANGES)) {
    const { start, end } = range;
    
    if (start <= end) {
      if (dateString >= start && dateString <= end) {
        return sign as ZodiacSign;
      }
    } else {
      if (dateString >= start || dateString <= end) {
        return sign as ZodiacSign;
      }
    }
  }
  
  return "capricorn";
};

export const getRandomZodiacSign = (): ZodiacSign => {
  const randomIndex = Math.floor(Math.random() * ZODIAC_SIGNS.length);
  return ZODIAC_SIGNS[randomIndex];
};