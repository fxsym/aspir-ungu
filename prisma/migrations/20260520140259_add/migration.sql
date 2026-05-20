/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `aspirations` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "aspirations" ADD COLUMN     "email" TEXT;

-- CreateTable
CREATE TABLE "OtpCode" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "expired" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OtpCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OtpCode_email_key" ON "OtpCode"("email");

-- CreateIndex
CREATE UNIQUE INDEX "aspirations_email_key" ON "aspirations"("email");
