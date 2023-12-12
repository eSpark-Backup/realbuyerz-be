/* eslint-disable prettier/prettier */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create cities
  await prisma.cities.create({
    data: {
      city_name: 'City1',
    },
  });

  // Create amenities
 const ameneties= await prisma.ameneties.create({
    data: {
      ameneties_name: 'Amenity1',
      count: 5,
      other_features: 'Feature1',
    },
  });

  // Create user
  const user = await prisma.user.create({
    data: {
      first_name: 'John',
      last_name: 'Doe',
      email: 'ahmedbhai@gmail.com',
      mobile_number: '1234567890',
      password: 'hashed_password',
      isVerified: true,
      social_id: 'social_id_123',
      role: 'user',
    },
  });

  // Create preferences
  await prisma.preferences.create({
    data: {
      user_id: user.id,
      email_notification: true,
      newsletter: false,
      automated_report: true,
      currency: 'USD',
      area_unit: 'sqft',
    },
  });


 const property = await prisma.property.create({
    data: {
      user_id: user.id,
      property_name: 'Property1',
      property_type: 'House',
      sub_type: 'Single-family',
      property_price: 500000,
      property_area: '2000 sqft',
      purpose: 'Sale',
      property_address: '123 Main St',
      property_city: 'City1',
      property_zip: '12345',
      property_description: 'Description of the property',
      property_ameneties: ameneties.id,
      longitude: '12.345',
      latitude: '67.890',
      property_status: true,
    },
  });
  // Create property data
   await prisma.porperty_data.create({
    data: {
      property_id:property.id ,
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
