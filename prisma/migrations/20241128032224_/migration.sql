/*
  Warnings:

  - Made the column `last_mcap` on table `tokens` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "CandlestickType" AS ENUM ('ONE_MIN', 'FIVE_MIN');

-- AlterTable
ALTER TABLE "candlesticks" ADD COLUMN     "type" "CandlestickType" NOT NULL DEFAULT 'ONE_MIN';

-- AlterTable
ALTER TABLE "tokens" ALTER COLUMN "last_mcap" SET NOT NULL,
ALTER COLUMN "last_mcap" SET DEFAULT 0,
ALTER COLUMN "last_mcap" SET DATA TYPE DOUBLE PRECISION;
