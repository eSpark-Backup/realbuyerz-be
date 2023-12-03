-- AlterTable
ALTER TABLE "Property" ALTER COLUMN "property_type" DROP NOT NULL,
ALTER COLUMN "property_price" DROP NOT NULL,
ALTER COLUMN "property_area" DROP NOT NULL,
ALTER COLUMN "purpose" DROP NOT NULL,
ALTER COLUMN "property_address" DROP NOT NULL,
ALTER COLUMN "property_zip" DROP NOT NULL,
ALTER COLUMN "property_description" DROP NOT NULL,
ALTER COLUMN "longitude" DROP NOT NULL,
ALTER COLUMN "latitude" DROP NOT NULL,
ALTER COLUMN "property_Image" DROP NOT NULL,
ALTER COLUMN "property_video" DROP NOT NULL,
ALTER COLUMN "sub_type" DROP NOT NULL,
ALTER COLUMN "property_status" DROP NOT NULL;
