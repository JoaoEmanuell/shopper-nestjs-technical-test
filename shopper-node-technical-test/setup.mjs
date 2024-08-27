import { mkdirSync, existsSync } from 'fs';

const databasePath = './src/database';
const imagesPath = './src/database/images';

if (!existsSync(databasePath)) {
  mkdirSync(databasePath); // create the database dir if not exists
}
if (!existsSync(imagesPath)) {
  mkdirSync(imagesPath); // create the tmp dir if not exists
}
