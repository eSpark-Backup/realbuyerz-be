/* eslint-disable prettier/prettier */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create cities
  await prisma.cities.create({
    data: {
      cityName: 'City1',
    },
  });

  // Create amenities
 const ameneties= await prisma.ameneties.create({
    data: {
      amenetiesName: 'Amenity1',
      count: 5,
      otherFeatures: 'Feature1',
    },
  });

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


 const property = await prisma.property.create({
    data: {
      userId: user.id,
      propertyName: 'Property1',
      propertyType: 'House',
      subType: 'Single-family',
      propertyPrice: 500000,
      propertyArea: '2000 sqft',
      purpose: 'Sale',
      propertyAddress: '123 Main St',
      propertyCity: 'City1',
      propertyZip: '12345',
      propertyDescription: 'Description of the property',
      propertyAmeneties: ameneties.id,
      longitude: '12.345',
      latitude: '67.890',
      propertyStatus: true,
    },
  });
  // Create property data
   await prisma.porperty_data.create({
    data: {
      propertyId:property.id ,
      url: 'https://example.com/property',
      type: 'residential',
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
