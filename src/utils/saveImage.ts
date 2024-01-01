/* eslint-disable prettier/prettier */
// image-utils.ts

import * as fsPromises from 'fs/promises';
import * as path from 'path';
import * as uuid from 'uuid';

export function generateRandomUUID(): string {
  return uuid.v4();
}

export async function saveImageToDisk(buffer: Buffer, filename: string): Promise<string> {
  const randomUUID = generateRandomUUID();
  const destinationFolder = 'upload';
  const filePath = path.join(destinationFolder, `${randomUUID}_${filename}`);

  await fsPromises.writeFile(filePath, buffer);
  return filePath;
}
