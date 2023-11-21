-- AlterTable
ALTER TABLE "User" ADD COLUMN     "profileImage" TEXT,
ALTER COLUMN "country" DROP NOT NULL,
ALTER COLUMN "Address" DROP NOT NULL;
