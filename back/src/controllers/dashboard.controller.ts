// File: back/src/controllers/dashboard.controller.ts
// Last change: Fixed import names to match service function names

import { Request, Response } from 'express';
import {
  get_dashboard_stats_service,
  get_dashboard_alerts_service,
} from '../services/dashboard.service';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const stats = await get_dashboard_stats_service();
    res.status(200).json(stats);
  } catch (error) {
    console.error('[DASHBOARD] Error fetching stats:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard stats.' });
  }
};

export const getDashboardAlerts = async (req: Request, res: Response) => {
  try {
    const alerts = await get_dashboard_alerts_service();
    res.status(200).json(alerts);
  } catch (error) {
    console.error('[DASHBOARD] Error fetching alerts:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard alerts.' });
  }
};