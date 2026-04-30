/*
  Warnings:

  - You are about to drop the column `user_id` on the `aspirations` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "aspirations" DROP CONSTRAINT "aspirations_user_id_fkey";

-- AlterTable
ALTER TABLE "aspirations" DROP COLUMN "user_id";
