export const convertStripeEventTypeToStatus = (eventType: string): 'ACTIVE' | 'CANCELLED' | 'FAILED' => {
  switch (eventType) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      return 'ACTIVE';
    case 'customer.subscription.deleted':
      return 'CANCELLED';
    case 'invoice.payment_failed':
      return 'FAILED';
    default:
      throw new Error(`Unhandled Stripe event type: ${eventType}`);
  }
}