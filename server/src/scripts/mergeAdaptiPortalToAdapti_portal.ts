import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

async function run() {
  const uri = process.env.MONGODB_URI || '';
  if (!uri) {
    console.error('MONGODB_URI not set');
    process.exit(1);
  }

  const client = new MongoClient(uri, { maxPoolSize: 10 });
  try {
    await client.connect();
    console.log('Connected');
    const srcDbName = 'adapti-portal';
    const tgtDbName = 'adapti_portal';
    const src = client.db(srcDbName);
    const tgt = client.db(tgtDbName);

    const cols = await src.listCollections().toArray();
    for (const c of cols) {
      const name = c.name;
      if (name.startsWith('system.')) continue;
      console.log(`\nMerging collection: ${name}`);
      const cursor = src.collection(name).find();
      let processed = 0;
      while (await cursor.hasNext()) {
        const doc = await cursor.next();
        if (!doc) continue;
        const docCopy = { ...doc };
        // remove undefined
        for (const k of Object.keys(docCopy)) if (docCopy[k] === undefined) delete docCopy[k];

        try {
          // First try upsert by _id
          await tgt.collection(name).updateOne({ _id: docCopy._id }, { $set: docCopy }, { upsert: true });
        } catch (err: any) {
          // Handle duplicate key errors for schools or known unique fields
          const msg = err?.message || err;
          console.warn('  - upsert by _id failed:', msg);

          try {
            if (name === 'schools' && docCopy.schoolId) {
              await tgt.collection(name).updateOne({ schoolId: docCopy.schoolId }, { $set: docCopy }, { upsert: true });
            } else if (docCopy.email) {
              await tgt.collection(name).updateOne({ email: docCopy.email }, { $set: docCopy }, { upsert: true });
            } else if (docCopy.code) {
              await tgt.collection(name).updateOne({ code: docCopy.code }, { $set: docCopy }, { upsert: true });
            } else {
              // As last resort, try to insert ignoring duplicates
              try {
                await tgt.collection(name).insertOne(docCopy);
              } catch (e: any) {
                console.error('    - final insert failed:', e?.message || e);
              }
            }
          } catch (e: any) {
            console.error('    - fallback upsert failed:', e?.message || e);
          }
        }

        processed++;
        if (processed % 500 === 0) console.log(`  processed ${processed}`);
      }

      console.log(`  finished merging ${name}, processed: ${processed}`);

      // ensure indexes copied (best-effort)
      try {
        const indexes = await src.collection(name).indexes();
        for (const ix of indexes) {
          if (ix.name === '_id_') continue;
          try {
            const key = ix.key;
            const options: any = { name: ix.name };
            if (ix.unique) options.unique = true;
            if (ix.sparse) options.sparse = true;
            await tgt.collection(name).createIndex(key, options);
          } catch (e: any) {
            console.warn('  - createIndex failed:', e?.message || e);
          }
        }
      } catch (e: any) {
        console.warn('  - indexes copy failed:', e?.message || e);
      }
    }

    console.log('\nMerge complete.');

    // After merge, drop source DB
    console.log(`Dropping source DB ${srcDbName}...`);
    const dropRes = await client.db(srcDbName).dropDatabase();
    console.log('Drop result:', dropRes);

  } catch (err: any) {
    console.error('Merge failed:', err?.message || err);
    process.exit(1);
  } finally {
    await client.close();
    console.log('Disconnected');
  }
}

run();
