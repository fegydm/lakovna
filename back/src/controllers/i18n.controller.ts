// File: back/src/controllers/i18n.controller.ts
// Last change: Refactored to align with project naming conventions (snake_case).

import { Request, Response } from 'express';
import { promises as fs } from 'fs';
import path from 'path';

export const get_translation_bundle = async (req: Request, res: Response) => {
  const { lc, ns } = req.query;

  if (typeof lc !== 'string' || typeof ns !== 'string' || !lc || !ns) {
    return res.status(400).json({ message: 'Language code (lc) and namespace (ns) are required.' });
  }

  try {
    // Skladáme cestu k prekladovému súboru
    // Príklad: /src/locales/sk/common.json
    const file_path = path.resolve(process.cwd(), 'back', 'src', 'locales', lc, `${ns}.json`);
    
    const data = await fs.readFile(file_path, 'utf-8');
    const bundle = JSON.parse(data);

    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache na 1 hodinu
    res.status(200).json(bundle);
  } catch (error: any) {
    // Ak sa súbor pre daný jazyk nenájde, vrátime anglickú verziu ako zálohu
    if (error.code === 'ENOENT' && lc !== 'en') {
      try {
        const fallback_path = path.resolve(process.cwd(), 'back', 'src', 'locales', 'en', `${ns}.json`);
        const data = await fs.readFile(fallback_path, 'utf-8');
        const bundle = JSON.parse(data);
        console.warn(`[i18n] Fallback: Translation for '${lc}/${ns}' not found. Serving 'en/${ns}'.`);
        res.setHeader('Cache-Control', 'public, max-age=3600');
        return res.status(200).json(bundle);
      } catch (fallback_error) {
        console.error(`[i18n] Critical: Fallback translation 'en/${ns}' also not found.`);
        return res.status(404).json({ message: `Translation bundle '${ns}' not found.` });
      }
    }
    
    console.error(`[i18n] Error loading translation for '${lc}/${ns}':`, error);
    res.status(500).json({ message: 'Failed to load translation bundle.' });
  }
};
