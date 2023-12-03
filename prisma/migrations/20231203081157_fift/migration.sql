-- DropForeignKey
ALTER TABLE "Property" DROP CONSTRAINT "Property_user_id_fkey";

-- AlterTable
ALTER TABLE "Property" ALTER COLUMN "user_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
