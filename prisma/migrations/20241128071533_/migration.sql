-- AlterTable
ALTER TABLE "trades" ALTER COLUMN "token_amount" SET DEFAULT 0,
ALTER COLUMN "token_amount" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "ron_amount" SET DEFAULT 0,
ALTER COLUMN "ron_amount" SET DATA TYPE DOUBLE PRECISION;
