/*
  Warnings:

  - You are about to drop the column `Address` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `landlineNumber` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `mobileNumber` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `profileImage` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "Address",
DROP COLUMN "createdAt",
DROP COLUMN "firstName",
DROP COLUMN "landlineNumber",
DROP COLUMN "lastName",
DROP COLUMN "mobileNumber",
DROP COLUMN "profileImage",
DROP COLUMN "updatedAt",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "first_name" TEXT,
ADD COLUMN     "isVerified" BOOLEAN,
ADD COLUMN     "landline_number" TEXT,
ADD COLUMN     "last_name" TEXT,
ADD COLUMN     "mobile_number" TEXT,
ADD COLUMN     "profile_image" TEXT,
ADD COLUMN     "social_id" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3),
ADD COLUMN     "visibility" BOOLEAN,
ADD COLUMN     "whatsapp" TEXT;
