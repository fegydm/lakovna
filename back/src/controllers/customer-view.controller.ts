// File: back/src/controllers/customer-view.controller.ts
// Last change: Aligned with naming conventions (camelCase for API responses).

import { Request, Response } from 'express';
import { get_processed_vehicle_tracking_data } from '../utils/bridge-vehicle.utils.js';

// ==================================================
// Helper function for API response transformation
// ==================================================

/**
 * Converts object keys from snake_case to camelCase recursively.
 * This ensures the API response follows the camelCase convention.
 * @param obj The object to convert.
 * @returns A new object with camelCase keys.
 */
const to_camel_case = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(v => to_camel_case(v));
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      const camel_key = key.replace(/([-_][a-z])/gi, ($1) =>
        $1.toUpperCase().replace('-', '').replace('_', '')
      );
      acc[camel_key] = to_camel_case(obj[key]);
      return acc;
    }, {} as { [key: string]: any });
  }
  return obj;
};

// ==================================================
// Controller Function
// ==================================================

/**
 * Gets and returns publicly available vehicle tracking information based on a token.
 * Intended for customers to track work progress.
 */
export const get_vehicle_tracking_details = async (req: Request, res: Response) => {
  const { token } = req.params;

  if (!token || typeof token !== 'string') {
    return res.status(400).json({ message: 'Valid tracking token is required.' });
  }

  try {
    // Call the bridge function which returns already processed data in snake_case
    const tracking_data_snake = await get_processed_vehicle_tracking_data(token);

    if (!tracking_data_snake) {
      return res.status(404).json({ message: 'Vehicle not found for the provided token.' });
    }

    // The controller's only presentation logic is to calculate the percentage.
    const completion_percentage =
      tracking_data_snake.progress.total_tasks > 0
        ? Math.round((tracking_data_snake.progress.completed_tasks / tracking_data_snake.progress.total_tasks) * 100)
        : 0;
        
    // Prepare the final response object, still in snake_case
    const response_data = {
      ...tracking_data_snake,
      progress: {
        ...tracking_data_snake.progress,
        completion_percentage,
      },
    };

    // Convert the entire response object to camelCase before sending
    res.status(200).json(to_camel_case(response_data));
  } catch (error) {
    console.error(`[CUSTOMER_VIEW] Error fetching vehicle by token ${token}:`, error);
    res.status(500).json({ message: 'Failed to fetch vehicle tracking information.' });
  }
};

