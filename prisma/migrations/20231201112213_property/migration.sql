-- CreateTable
CREATE TABLE "Porperty_video" (
    "id" SERIAL NOT NULL,
    "property_id" INTEGER NOT NULL,
    "video_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "Porperty_video_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Property_Images" (
    "id" SERIAL NOT NULL,
    "property_id" INTEGER NOT NULL,
    "image_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "Property_Images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cities" (
    "id" SERIAL NOT NULL,
    "city_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "Cities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ameneties" (
    "id" SERIAL NOT NULL,
    "bed_room" INTEGER,
    "bath_room" INTEGER,
    "kitchen" INTEGER,
    "parking" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "Ameneties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Property" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "property_name" TEXT NOT NULL,
    "property_type" TEXT NOT NULL,
    "property_price" INTEGER NOT NULL,
    "property_area" INTEGER NOT NULL,
    "purpose" TEXT NOT NULL,
    "property_address" TEXT NOT NULL,
    "property_city" TEXT NOT NULL,
    "property_state" TEXT NOT NULL,
    "property_country" TEXT NOT NULL,
    "property_zip" TEXT NOT NULL,
    "property_description" TEXT NOT NULL,
    "property_ameneties" INTEGER NOT NULL,
    "property_video" INTEGER NOT NULL,
    "property_image" INTEGER NOT NULL,
    "longitude" TEXT NOT NULL,
    "latitude" TEXT NOT NULL,
    "property_status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Property_property_ameneties_key" ON "Property"("property_ameneties");

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_property_image_fkey" FOREIGN KEY ("property_image") REFERENCES "Property_Images"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_property_video_fkey" FOREIGN KEY ("property_video") REFERENCES "Porperty_video"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_property_ameneties_fkey" FOREIGN KEY ("property_ameneties") REFERENCES "Ameneties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
