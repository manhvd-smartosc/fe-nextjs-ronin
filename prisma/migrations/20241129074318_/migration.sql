/*
  Warnings:

  - A unique constraint covering the columns `[transaction_hash,log_index]` on the table `trades` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "tokens" ADD COLUMN     "log_index" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "transaction_hash" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "transaction_index" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "trades" ADD COLUMN     "log_index" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "transaction_index" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "transaction_hash" SET DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "trades_transaction_hash_log_index_key" ON "trades"("transaction_hash", "log_index");
