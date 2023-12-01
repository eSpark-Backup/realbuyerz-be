/*
  Warnings:

  - You are about to drop the column `property_country` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `property_state` on the `Property` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[property_city]` on the table `Property` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `property_Image` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `property_video` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sub_type` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `property_city` on the `Property` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Property" DROP CONSTRAINT "Property_property_ameneties_fkey";

-- AlterTable
ALTER TABLE "Property" DROP COLUMN "property_country",
DROP COLUMN "property_state",
ADD COLUMN     "property_Image" TEXT NOT NULL,
ADD COLUMN     "property_video" TEXT NOT NULL,
ADD COLUMN     "sub_type" TEXT NOT NULL,
ALTER COLUMN "property_area" SET DATA TYPE TEXT,
DROP COLUMN "property_city",
ADD COLUMN     "property_city" INTEGER NOT NULL,
ALTER COLUMN "property_ameneties" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Property_property_city_key" ON "Property"("property_city");

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_property_ameneties_fkey" FOREIGN KEY ("property_ameneties") REFERENCES "Ameneties"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_property_city_fkey" FOREIGN KEY ("property_city") REFERENCES "Cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
