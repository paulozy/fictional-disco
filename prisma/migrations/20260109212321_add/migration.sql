-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "paymentGatewayCustomerId" TEXT;

-- CreateIndex
CREATE INDEX "companies_paymentGatewayCustomerId_idx" ON "companies"("paymentGatewayCustomerId");
