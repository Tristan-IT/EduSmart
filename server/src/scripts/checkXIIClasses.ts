import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const ClassModel = (await import('../models/Class.js')).default;
  const classes = await ClassModel.find({ grade: 12 }, 'className majorCode');
  console.log('XII classes:');
  classes.forEach(c => console.log(c.className + ' (' + c.majorCode + ')'));
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
