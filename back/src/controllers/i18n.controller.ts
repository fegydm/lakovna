// File: back/src/controllers/i18n.controller.ts
// Last change: Created minimal i18n controller to load translations from static JSON files

import { Request, Response } from 'express';
import { promises as fs } from 'fs';
import path from 'path';

export const getTranslationBundle = async (req: Request, res: Response) => {
  const { lc, ns } = req.query;

  if (typeof lc !== 'string' || typeof ns !== 'string' || !lc || !ns) {
    return res.status(400).json({ message: 'Language code (lc) and namespace (ns) are required.' });
  }

  try {
    // We construct the path to the translation file
    // Example: /src/locales/sk/common.json
    const filePath = path.resolve(process.cwd(), 'back', 'src', 'locales', lc, `${ns}.json`);
    
    const data = await fs.readFile(filePath, 'utf-8');
    const bundle = JSON.parse(data);

    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    res.status(200).json(bundle);
  } catch (error: any) {
    // If a specific language file is not found, we fall back to English
    if (error.code === 'ENOENT' && lc !== 'en') {
      try {
        const fallbackPath = path.resolve(process.cwd(), 'back', 'src', 'locales', 'en', `${ns}.json`);
        const data = await fs.readFile(fallbackPath, 'utf-8');
        const bundle = JSON.parse(data);
        console.warn(`[i18n] Fallback: Translation for '${lc}/${ns}' not found. Serving 'en/${ns}'.`);
        res.setHeader('Cache-Control', 'public, max-age=3600');
        return res.status(200).json(bundle);
      } catch (fallbackError) {
        console.error(`[i18n] Critical: Fallback translation 'en/${ns}' also not found.`);
        return res.status(404).json({ message: `Translation bundle '${ns}' not found.` });
      }
    }
    
    console.error(`[i18n] Error loading translation for '${lc}/${ns}':`, error);
    res.status(500).json({ message: 'Failed to load translation bundle.' });
  }
};
