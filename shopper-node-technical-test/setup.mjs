import { mkdirSync, existsSync } from 'fs';

const databasePath = './src/database';
const tmpPath = './src/tmp';

if (!existsSync(databasePath)) {
  mkdirSync(databasePath); // create the database dir if not exists
}
if (!existsSync(tmpPath)) {
  mkdirSync(tmpPath); // create the tmp dir if not exists
}
