import { PlanType } from './plan-type.enum';

export interface PlanLimits {
  maxEmployees: number | 'unlimited';
  autoGenerateSchedule: boolean;
  supportLevel: 'basic' | 'priority';
}

export const PLANS: Record<PlanType, PlanLimits> = {
  [PlanType.FREE]: {
    maxEmployees: 5,
    autoGenerateSchedule: false,
    supportLevel: 'basic',
  },

  [PlanType.PRO]: {
    maxEmployees: 'unlimited',
    autoGenerateSchedule: true,
    supportLevel: 'priority',
  },
};
