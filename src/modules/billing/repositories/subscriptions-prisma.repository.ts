import { PrismaClient } from '@prisma/client';
import { PlanType, Subscription, SubscriptionStatus } from '../entities/subscription.entity';
import { CreateSubscriptionProps, SubscriptionsRepository, UpdateSubscriptionProps } from './subscriptions-repository.interface';

export class SubscriptionsPrismaRepository implements SubscriptionsRepository {
  constructor(private prismaClient: PrismaClient) { }

  async create(props: CreateSubscriptionProps): Promise<Subscription> {
    const subscription = await this.prismaClient.subscription.create({
      data: {
        companyId: props.companyId,
        plan: props.plan,
        status: props.status,
        paymentGatewayCustomerId: props.paymentGatewayCustomerId,
        paymentGatewaySubscriptionId: props.paymentGatewaySubscriptionId,
      },
    });

    return this.toDomain(subscription);
  }

  async findById(id: string): Promise<Subscription | null> {
    const subscription = await this.prismaClient.subscription.findUnique({
      where: { id },
    });

    return subscription ? this.toDomain(subscription) : null;
  }

  async findAll(): Promise<Subscription[]> {
    const subscriptions = await this.prismaClient.subscription.findMany();
    return subscriptions.map((sub) => this.toDomain(sub));
  }

  async update(id: string, props: UpdateSubscriptionProps): Promise<Subscription> {
    const subscription = await this.prismaClient.subscription.update({
      where: { id },
      data: {
        plan: props.plan,
        status: props.status,
        paymentGatewayCustomerId: props.paymentGatewayCustomerId,
        paymentGatewaySubscriptionId: props.paymentGatewaySubscriptionId,
      },
    });

    return this.toDomain(subscription);
  }

  async delete(id: string): Promise<void> {
    await this.prismaClient.subscription.delete({
      where: { id },
    });
  }

  async findByCompanyId(companyId: string): Promise<Subscription | null> {
    const subscription = await this.prismaClient.subscription.findUnique({
      where: { companyId },
    });

    return subscription ? this.toDomain(subscription) : null;
  }

  async findByPaymentGatewayCustomerId(customerId: string): Promise<Subscription | null> {
    const subscription = await this.prismaClient.subscription.findUnique({
      where: { paymentGatewayCustomerId: customerId },
    });

    return subscription ? this.toDomain(subscription) : null;
  }

  private toDomain(raw: any): Subscription {
    return Subscription.create({
      id: raw.id,
      companyId: raw.companyId,
      plan: raw.plan as PlanType,
      status: raw.status as SubscriptionStatus,
      paymentGatewayCustomerId: raw.paymentGatewayCustomerId,
      paymentGatewaySubscriptionId: raw.paymentGatewaySubscriptionId,
      createdAt: raw.createdAt,
    });
  }
}
