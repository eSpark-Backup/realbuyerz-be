/*
  Warnings:

  - You are about to drop the column `profile_image` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `visibility` on the `User` table. All the data in the column will be lost.
  - Added the required column `profile_visibility` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `first_name` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `isVerified` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `last_name` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `mobile_number` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `social_id` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "profile_image",
DROP COLUMN "visibility",
ADD COLUMN     "profileImage" TEXT,
ADD COLUMN     "profile_visibility" BOOLEAN NOT NULL,
ALTER COLUMN "first_name" SET NOT NULL,
ALTER COLUMN "isVerified" SET NOT NULL,
ALTER COLUMN "last_name" SET NOT NULL,
ALTER COLUMN "mobile_number" SET NOT NULL,
ALTER COLUMN "social_id" SET NOT NULL;
