// File: database/utils/database.utils.ts
// Last change: Refactored to be truly database-agnostic using a data-fetching function

import { MOCK_DATA } from '../seeds/mock.data';

type DataFetcher = () => Promise<any[]>;

const is_development = process.env.NODE_ENV === 'development';
const is_db_enabled = process.env.DATABASE_ENABLED === 'true';

// Hlavná funkcia na získavanie dát
export const get_data_with_fallback = async (data_fetcher: DataFetcher, model_name: string): Promise<any[] | null> => {
  if (is_development || !is_db_enabled) {
    console.log(`[DEV] Using mock data for model: ${model_name}`);
    // @ts-ignore
    return MOCK_DATA[model_name];
  }

  try {
    const data = await data_fetcher();
    return data;
  } catch (error) {
    console.error(`Failed to fetch from DB. Falling back to mock data.`, error);
    // @ts-ignore
    return MOCK_DATA[model_name];
  }
};