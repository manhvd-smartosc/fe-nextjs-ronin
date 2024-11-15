-- AlterTable
ALTER TABLE "tokens" ADD COLUMN     "init_mcap" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "trades" ADD COLUMN     "last_mcap" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "wallet_logins" ADD COLUMN     "last_updated_name" TIMESTAMP(3);
