import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const UserModel = (await import('../models/User.js')).default;
  const ClassModel = (await import('../models/Class.js')).default;
  const xiiClasses = await ClassModel.find({ grade: 12 }, '_id className majorCode');
  for (const cls of xiiClasses) {
    const count = await UserModel.countDocuments({ role: 'student', class: cls._id });
    console.log(`${cls.className} (${cls.majorCode}): ${count} students`);
  }
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
