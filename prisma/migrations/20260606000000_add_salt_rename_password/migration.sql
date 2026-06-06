-- AlterTable: Add salt column and rename password to passwordHash
ALTER TABLE "User" ADD COLUMN "salt" TEXT;
ALTER TABLE "User" RENAME COLUMN "password" TO "passwordHash";
