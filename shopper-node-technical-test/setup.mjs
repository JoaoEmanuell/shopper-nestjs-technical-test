import { existsSync, mkdirSync, writeFileSync } from 'fs';

const databasePath = './src/database';
const imagesPath = './src/database/images';

if (!existsSync(databasePath)) {
  mkdirSync(databasePath); // create the database dir if not exists
}
if (!existsSync(imagesPath)) {
  mkdirSync(imagesPath); // create the tmp dir if not exists
}
if (!existsSync(`${databasePath}/db.sqlite`)) {
  writeFileSync(`${databasePath}/db.sqlite`, ''); // create a empty db file
}
