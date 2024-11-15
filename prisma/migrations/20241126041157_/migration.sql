-- CreateEnum
CREATE TYPE "TradeType" AS ENUM ('BUY', 'SELL');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatar_url" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bio" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallet_logins" (
    "id" BIGSERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "nonce" TEXT NOT NULL,
    "expired_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wallet_logins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tokens" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "ticker" TEXT NOT NULL,
    "description" TEXT,
    "address" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,
    "last_buy" BIGINT NOT NULL DEFAULT 0,
    "last_comment" BIGINT NOT NULL DEFAULT 0,
    "total_comments" INTEGER DEFAULT 0,
    "last_price" BIGINT DEFAULT 0,
    "init_price" BIGINT DEFAULT 0,
    "pool_id" TEXT,
    "last_mcap" BIGINT DEFAULT 0,
    "image_url" TEXT NOT NULL,
    "telegram_url" TEXT,
    "twitter_url" TEXT,
    "website_url" TEXT,
    "created_at" BIGINT NOT NULL DEFAULT 0,

    CONSTRAINT "tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trades" (
    "id" BIGSERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "token_id" BIGINT NOT NULL,
    "token_amount" BIGINT NOT NULL DEFAULT 0,
    "ron_amount" BIGINT NOT NULL DEFAULT 0,
    "created_at" BIGINT NOT NULL DEFAULT 0,
    "type" "TradeType" NOT NULL,
    "transaction_hash" TEXT NOT NULL,
    "last_price" BIGINT NOT NULL DEFAULT 0,

    CONSTRAINT "trades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" BIGSERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "token_id" BIGINT NOT NULL,
    "text" TEXT NOT NULL,
    "image_url" TEXT,
    "created_at" BIGINT NOT NULL DEFAULT 0,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "candlesticks" (
    "id" BIGSERIAL NOT NULL,
    "token_id" BIGINT NOT NULL,
    "open" BIGINT NOT NULL DEFAULT 0,
    "close" BIGINT NOT NULL DEFAULT 0,
    "high" BIGINT NOT NULL DEFAULT 0,
    "low" BIGINT NOT NULL DEFAULT 0,
    "volume" BIGINT NOT NULL DEFAULT 0,
    "timestamp" BIGINT NOT NULL DEFAULT 0,

    CONSTRAINT "candlesticks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_address_key" ON "users"("address");

-- CreateIndex
CREATE UNIQUE INDEX "wallet_logins_user_id_key" ON "wallet_logins"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "tokens_address_key" ON "tokens"("address");

-- AddForeignKey
ALTER TABLE "wallet_logins" ADD CONSTRAINT "wallet_logins_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tokens" ADD CONSTRAINT "tokens_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trades" ADD CONSTRAINT "trades_token_id_fkey" FOREIGN KEY ("token_id") REFERENCES "tokens"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trades" ADD CONSTRAINT "trades_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_token_id_fkey" FOREIGN KEY ("token_id") REFERENCES "tokens"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candlesticks" ADD CONSTRAINT "candlesticks_token_id_fkey" FOREIGN KEY ("token_id") REFERENCES "tokens"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
