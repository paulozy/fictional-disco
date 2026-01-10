import express, { Router } from 'express';
import { authMiddleware } from '../../infra/http/middlewares/auth.middleware';
import { ControllersFactory } from '../../shared/factories/controllers.factory';

const billingRoutes = Router();

/**
 * POST /billing/checkout
 * Creates a new checkout for PRO plan upgrade
 * @requires auth
 */
billingRoutes.post('/checkout', authMiddleware, (req, res) =>
  ControllersFactory.createCheckoutController().handle(req, res)
);

/**
 * GET /billing/status
 * Get current subscription status for authenticated company
 * @requires auth
 */
billingRoutes.get('/status', authMiddleware, (req, res) =>
  ControllersFactory.getSubscriptionStatusController().handle(req, res)
);

/**
 * DELETE /billing/subscription
 * Cancel current subscription for authenticated company
 * @requires auth
 */
billingRoutes.delete('/subscription', authMiddleware, (req, res) =>
  ControllersFactory.cancelSubscriptionController().handle(req, res)
);

/**
 * POST /billing/webhook
 * Receives webhook from AbacatePay for subscription updates
 * @public
 */
billingRoutes.post('/webhook', express.raw({ type: 'application/json' }), (req, res) =>
  ControllersFactory.webhookController().handle(req, res)
);

export { billingRoutes };
