-- AlterTable
ALTER TABLE "tokens" ADD COLUMN     "block_number" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "trades" ADD COLUMN     "block_number" INTEGER NOT NULL DEFAULT 0;
