-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING_ADMIN_REVISION', 'OPEN_FOR_BIDDING', 'BIDS_RECEIVED', 'OFFERS_FORWARDED', 'ORDER_PAID_PENDING_DELIVERY', 'CLOSED_SUCCESS', 'CLOSED_CANCELLED', 'REJECTED');

-- CreateEnum
CREATE TYPE "BidStatus" AS ENUM ('PENDING', 'SELECTED', 'ACCEPTED_BY_CLIENT', 'REJECTED', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "DeliveryStatus" AS ENUM ('ORDER_PLACED', 'VENDOR_PREPARING', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY', 'IN_TRANSIT', 'DELIVERED', 'FAILED_DELIVERY', 'RETURNED');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('ESCROW_DEPOSIT', 'VENDOR_PAYOUT', 'ADMIN_COMMISSION', 'REFUND', 'WITHDRAWAL');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('NEW_REQUEST', 'NEW_BID', 'OFFER_RECEIVED', 'BID_ACCEPTED', 'DELIVERY_UPDATE', 'PAYMENT_RECEIVED', 'REQUEST_DISPATCHED', 'WALLET_TOPUP');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "walletBalance" DECIMAL(12,2) NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendorCategory" (
    "id" SERIAL NOT NULL,
    "vendorId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "VendorCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Request" (
    "id" SERIAL NOT NULL,
    "clientId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "latitude" DECIMAL(10,7) NOT NULL,
    "longitude" DECIMAL(10,7) NOT NULL,
    "deliveryPhone" TEXT NOT NULL,
    "notes" TEXT,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING_ADMIN_REVISION',
    "selectedBidId" INTEGER,
    "qrCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequestImage" (
    "id" SERIAL NOT NULL,
    "requestId" INTEGER NOT NULL,
    "filePath" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RequestImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bid" (
    "id" SERIAL NOT NULL,
    "requestId" INTEGER NOT NULL,
    "vendorId" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "netPrice" DECIMAL(12,2) NOT NULL,
    "clientPrice" DECIMAL(12,2) NOT NULL,
    "status" "BidStatus" NOT NULL DEFAULT 'PENDING',
    "adminNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bid_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BidImage" (
    "id" SERIAL NOT NULL,
    "bidId" INTEGER NOT NULL,
    "filePath" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BidImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeliveryTracking" (
    "id" SERIAL NOT NULL,
    "requestId" INTEGER NOT NULL,
    "status" "DeliveryStatus" NOT NULL,
    "note" TEXT,
    "locationText" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DeliveryTracking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "requestId" INTEGER,
    "amount" DECIMAL(12,2) NOT NULL,
    "type" "TransactionType" NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlatformSetting" (
    "id" SERIAL NOT NULL,
    "commissionPercent" DECIMAL(5,2) NOT NULL DEFAULT 15,
    "minVendorMatchCount" INTEGER NOT NULL DEFAULT 3,
    "initialRadiusKm" INTEGER NOT NULL DEFAULT 5,
    "maxRadiusKm" INTEGER NOT NULL DEFAULT 50,
    "radiusExpansionStepKm" INTEGER NOT NULL DEFAULT 5,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlatformSetting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE INDEX "Category_slug_idx" ON "Category"("slug");

-- CreateIndex
CREATE INDEX "VendorCategory_vendorId_idx" ON "VendorCategory"("vendorId");

-- CreateIndex
CREATE INDEX "VendorCategory_categoryId_idx" ON "VendorCategory"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "VendorCategory_vendorId_categoryId_key" ON "VendorCategory"("vendorId", "categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "Request_selectedBidId_key" ON "Request"("selectedBidId");

-- CreateIndex
CREATE INDEX "Request_clientId_idx" ON "Request"("clientId");

-- CreateIndex
CREATE INDEX "Request_categoryId_idx" ON "Request"("categoryId");

-- CreateIndex
CREATE INDEX "Request_status_idx" ON "Request"("status");

-- CreateIndex
CREATE INDEX "RequestImage_requestId_idx" ON "RequestImage"("requestId");

-- CreateIndex
CREATE INDEX "Bid_requestId_idx" ON "Bid"("requestId");

-- CreateIndex
CREATE INDEX "Bid_vendorId_idx" ON "Bid"("vendorId");

-- CreateIndex
CREATE INDEX "Bid_status_idx" ON "Bid"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Bid_requestId_vendorId_key" ON "Bid"("requestId", "vendorId");

-- CreateIndex
CREATE INDEX "BidImage_bidId_idx" ON "BidImage"("bidId");

-- CreateIndex
CREATE INDEX "DeliveryTracking_requestId_idx" ON "DeliveryTracking"("requestId");

-- CreateIndex
CREATE INDEX "DeliveryTracking_status_idx" ON "DeliveryTracking"("status");

-- CreateIndex
CREATE INDEX "Transaction_userId_idx" ON "Transaction"("userId");

-- CreateIndex
CREATE INDEX "Transaction_type_idx" ON "Transaction"("type");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "Notification_isRead_idx" ON "Notification"("isRead");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_isActive_idx" ON "User"("isActive");

-- AddForeignKey
ALTER TABLE "VendorCategory" ADD CONSTRAINT "VendorCategory_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorCategory" ADD CONSTRAINT "VendorCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestImage" ADD CONSTRAINT "RequestImage_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BidImage" ADD CONSTRAINT "BidImage_bidId_fkey" FOREIGN KEY ("bidId") REFERENCES "Bid"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeliveryTracking" ADD CONSTRAINT "DeliveryTracking_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
