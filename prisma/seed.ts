/* eslint-disable prettier/prettier */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  try {

  

    // Seed data for Property_Images model
   

    // Seed data for Cities model
    await prisma.cities.createMany({
      data: [
        { city_name: 'New York' },
        { city_name: 'Los Angeles' },
      ],
    });

    // Seed data for Ameneties model
    await prisma.ameneties.createMany({
      data: [
        { bed_room: 2, bath_room: 2, kitchen: 1, parking: 1 },
        { bed_room: 3, bath_room: 2, kitchen: 1, parking: 2 },
      ],
    });

    console.log('Seed data successfully inserted.');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
