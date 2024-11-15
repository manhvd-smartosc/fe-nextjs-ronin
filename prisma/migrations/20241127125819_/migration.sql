/*
  Warnings:

  - You are about to drop the column `last_updated_name` on the `wallet_logins` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "last_updated_name" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "wallet_logins" DROP COLUMN "last_updated_name";
