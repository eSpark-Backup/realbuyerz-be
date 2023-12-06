/*
  Warnings:

  - A unique constraint covering the columns `[property_ameneties]` on the table `Property` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "property_ameneties" INTEGER,
ADD COLUMN     "property_city" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Property_property_ameneties_key" ON "Property"("property_ameneties");

-- AddForeignKey
ALTER TABLE "Porperty_data" ADD CONSTRAINT "Porperty_data_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_property_ameneties_fkey" FOREIGN KEY ("property_ameneties") REFERENCES "Ameneties"("id") ON DELETE SET NULL ON UPDATE CASCADE;
