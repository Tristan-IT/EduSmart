import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI not set');
    process.exit(1);
  }

  await mongoose.connect(uri);
  const db = mongoose.connection.useDb('adapti_portal');

  const ownerEmail = 'kepala.sekolah@smktiglobal.sch.id';
  const targetSchoolId = 'SCH-00012';

  const owner = await db.collection('users').findOne({ email: ownerEmail });
  const targetSchool = await db.collection('schools').findOne({ schoolId: targetSchoolId });

  console.log('owner found:', !!owner, owner? owner._id : null);
  console.log('targetSchool found:', !!targetSchool, targetSchool? targetSchool._id : null);

  if (!owner || !targetSchool) {
    console.error('Required documents not found. Aborting.');
    await mongoose.disconnect();
    process.exit(1);
  }

  // Update user -> point to target school
  await db.collection('users').updateOne({ _id: owner._id }, {
    $set: {
      ownedSchool: targetSchool._id,
      school: targetSchool._id,
      schoolName: targetSchool.schoolName,
    }
  });

  // Update school -> set owner fields to this user
  await db.collection('schools').updateOne({ _id: targetSchool._id }, {
    $set: {
      owner: owner._id,
      ownerEmail: owner.email,
      ownerName: owner.name,
    }
  });

  console.log('Link updated: owner -> school and school -> owner');

  await mongoose.disconnect();
}

run().catch(e=>{console.error(e);process.exit(1)})
