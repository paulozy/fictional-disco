import { Subscription } from '../entities/subscription.entity';
import { CreateSubscriptionProps, SubscriptionsRepository, UpdateSubscriptionProps } from './subscriptions-repository.interface';

export class InMemorySubscriptionsRepository implements SubscriptionsRepository {
  private subscriptions: Subscription[] = [];

  async create(props: CreateSubscriptionProps): Promise<Subscription> {
    const subscription = Subscription.create({
      id: Math.random().toString(36).substr(2, 9),
      ...props,
    });

    this.subscriptions.push(subscription);
    return subscription;
  }

  async findById(id: string): Promise<Subscription | null> {
    return this.subscriptions.find((sub) => sub.id === id) || null;
  }

  async findAll(): Promise<Subscription[]> {
    return this.subscriptions;
  }

  async update(id: string, props: UpdateSubscriptionProps): Promise<Subscription> {
    const subscription = this.subscriptions.find((sub) => sub.id === id);
    if (!subscription) {
      throw new Error('Subscription not found');
    }

    if (props.plan) subscription.plan = props.plan;
    if (props.status) subscription.status = props.status;
    if (props.paymentGatewayCustomerId) subscription.paymentGatewayCustomerId = props.paymentGatewayCustomerId;
    if (props.paymentGatewaySubscriptionId) subscription.paymentGatewaySubscriptionId = props.paymentGatewaySubscriptionId;

    return subscription;
  }

  async delete(id: string): Promise<void> {
    const index = this.subscriptions.findIndex((sub) => sub.id === id);
    if (index !== -1) {
      this.subscriptions.splice(index, 1);
    }
  }

  async findByCompanyId(companyId: string): Promise<Subscription | null> {
    return this.subscriptions.find((sub) => sub.companyId === companyId) || null;
  }

  async findByPaymentGatewayCustomerId(customerId: string): Promise<Subscription | null> {
    return this.subscriptions.find((sub) => sub.paymentGatewayCustomerId === customerId) || null;
  }
}
