/*
  Warnings:

  - Made the column `last_price` on table `tokens` required. This step will fail if there are existing NULL values in that column.
  - Made the column `init_price` on table `tokens` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "tokens" ALTER COLUMN "last_price" SET NOT NULL,
ALTER COLUMN "last_price" SET DEFAULT 0,
ALTER COLUMN "last_price" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "init_price" SET NOT NULL,
ALTER COLUMN "init_price" SET DEFAULT 0,
ALTER COLUMN "init_price" SET DATA TYPE DOUBLE PRECISION;
