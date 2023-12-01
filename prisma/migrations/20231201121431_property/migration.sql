/*
  Warnings:

  - You are about to drop the column `property_image` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `property_video` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the `Porperty_video` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Property_Images` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Property" DROP CONSTRAINT "Property_property_image_fkey";

-- DropForeignKey
ALTER TABLE "Property" DROP CONSTRAINT "Property_property_video_fkey";

-- AlterTable
ALTER TABLE "Property" DROP COLUMN "property_image",
DROP COLUMN "property_video";

-- DropTable
DROP TABLE "Porperty_video";

-- DropTable
DROP TABLE "Property_Images";

-- CreateTable
CREATE TABLE "Porperty_data" (
    "id" SERIAL NOT NULL,
    "property_id" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "Porperty_data_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Porperty_data" ADD CONSTRAINT "Porperty_data_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
