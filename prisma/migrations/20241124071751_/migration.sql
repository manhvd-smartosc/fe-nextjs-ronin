-- AlterTable
ALTER TABLE "tokens" ALTER COLUMN "last_price" SET DEFAULT 0,
ALTER COLUMN "last_mcap" SET DEFAULT 0,
ALTER COLUMN "total_comments" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "trades" ALTER COLUMN "token_amount" SET DEFAULT 0,
ALTER COLUMN "ron_amount" SET DEFAULT 0;
