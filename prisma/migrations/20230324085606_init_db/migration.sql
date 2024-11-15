-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT,
    "image" TEXT,
    "publicAddress" TEXT
);

-- CreateTable
CREATE TABLE "CryptoLoginNonce" (
    "userId" TEXT NOT NULL,
    "nonce" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    CONSTRAINT "CryptoLoginNonce_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_publicAddress_key" ON "User"("publicAddress");

-- CreateIndex
CREATE UNIQUE INDEX "CryptoLoginNonce_userId_key" ON "CryptoLoginNonce"("userId");
