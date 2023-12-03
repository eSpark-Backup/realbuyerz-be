/*
  Warnings:

  - You are about to drop the column `property_ameneties` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `property_city` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Property` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Porperty_data" DROP CONSTRAINT "Porperty_data_property_id_fkey";

-- DropForeignKey
ALTER TABLE "Property" DROP CONSTRAINT "Property_property_ameneties_fkey";

-- DropForeignKey
ALTER TABLE "Property" DROP CONSTRAINT "Property_property_city_fkey";

-- DropForeignKey
ALTER TABLE "Property" DROP CONSTRAINT "Property_user_id_fkey";

-- DropIndex
DROP INDEX "Property_property_ameneties_key";

-- DropIndex
DROP INDEX "Property_property_city_key";

-- AlterTable
ALTER TABLE "Property" DROP COLUMN "property_ameneties",
DROP COLUMN "property_city",
DROP COLUMN "user_id";
