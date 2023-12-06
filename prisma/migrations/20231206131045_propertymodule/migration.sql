-- CreateTable
CREATE TABLE "Property_features" (
    "id" SERIAL NOT NULL,
    "property_id" TEXT NOT NULL,
    "feature_type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "Property_features_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Property_features" ADD CONSTRAINT "Property_features_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
