/*
  Warnings:

  - The primary key for the `Property` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Porperty_data" DROP CONSTRAINT "Porperty_data_property_id_fkey";

-- AlterTable
ALTER TABLE "Porperty_data" ALTER COLUMN "property_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Property" DROP CONSTRAINT "Property_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Property_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Property_id_seq";

-- AddForeignKey
ALTER TABLE "Porperty_data" ADD CONSTRAINT "Porperty_data_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
