/* eslint-disable prettier/prettier */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create cities

  // Create amenities

  // Create user
  const user = await prisma.user.create({
    data: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'ahmedbhai@gmail.com',
      mobileNumber: '1234567890',
      password: 'hashed_password',
      isVerified: true,
      socialId: 'social_id_123',
      role: 'user',
    },
  });

  // Create preferences
  await prisma.preferences.create({
    data: {
      userId: user.id,
      emailNotification: true,
      newsLetter: false,
      automatedReport: true,
      currency: 'USD',
      areaUnit: 'sqft',
    },
  });

  // Create property
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
