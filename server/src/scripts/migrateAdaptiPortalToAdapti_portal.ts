import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

async function run() {
  const uri = process.env.MONGODB_URI || '';
  if (!uri) {
    console.error('MONGODB_URI not set in environment');
    process.exit(1);
  }

  // We will connect directly with the connection string and specify full DB names for source/target.
  // Replace the database part if present. The seed was previously targeting `adapti-portal`.
  const client = new MongoClient(uri, { maxPoolSize: 10 });

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const srcDbName = 'adapti-portal';
    const tgtDbName = 'adapti_portal';

    const srcDb = client.db(srcDbName);
    const tgtDb = client.db(tgtDbName);

    // Get collections present in source db
    const collections = await srcDb.listCollections().toArray();
    const names = collections.map(c => c.name);

    console.log('Collections to copy:', names);

    for (const name of names) {
      console.log(`\nCopying collection: ${name}`);

      const srcColl = srcDb.collection(name);
      const tgtColl = tgtDb.collection(name);

      // Optionally skip system collections
      if (name.startsWith('system.')) {
        console.log('  - skipping system collection');
        continue;
      }

      // Count docs in source
      const count = await srcColl.countDocuments();
      console.log(`  - source count: ${count}`);

      if (count === 0) {
        console.log('  - nothing to copy');
        continue;
      }

      // Read documents in batches to avoid memory blowup
      const batchSize = 1000;
      const cursor = srcColl.find();
      let copied = 0;

      while (await cursor.hasNext()) {
        const batch: any[] = [];
        for (let i = 0; i < batchSize; i++) {
          if (!(await cursor.hasNext())) break;
          const doc = await cursor.next();
          // Make sure _id stays the same; if needed you can transform
          batch.push(doc);
        }

        if (batch.length > 0) {
          // Insert into target; if docs with same _id already exist, replace them
          try {
            // use bulkWrite with upsert to avoid duplicates
            const operations = batch.map(d => ({ replaceOne: { filter: { _id: d._id }, replacement: d, upsert: true } }));
            const res = await tgtColl.bulkWrite(operations, { ordered: false });
            copied += batch.length;
            console.log(`  - copied batch: ${batch.length} (total copied: ${copied})`);
          } catch (err) {
            console.error('  - batch write error:', err);
            // fallback: try inserting individual docs
            for (const d of batch) {
              try {
                await tgtColl.replaceOne({ _id: d._id }, d, { upsert: true });
                copied++;
              } catch (e) {
                console.error('    - doc copy failed for _id=', d._id, e);
              }
            }
          }
        }
      }

      console.log(`  - finished copying ${name}: ${copied} documents`);

      // Recreate indexes from source to target
      try {
        const indexes = await srcColl.indexes();
        for (const ix of indexes) {
          if (ix.name === '_id_') continue;
          // Remove key that may contain options not allowed in createIndex
          const key = ix.key;
          const options: any = { name: ix.name };
          if (ix.unique) options.unique = true;
          if (ix.sparse) options.sparse = true;
          try {
            await tgtColl.createIndex(key, options);
            console.log(`  - created index ${ix.name}`);
          } catch (e: any) {
            console.warn(`  - failed to create index ${ix.name}:`, e?.message || e);
          }
        }
      } catch (e: any) {
        console.warn('  - failed to copy indexes:', e?.message || e);
      }
    }

    console.log('\nMigration complete.');
    console.log(`Source DB: ${srcDbName}`);
    console.log(`Target DB: ${tgtDbName}`);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    await client.close();
    console.log('Disconnected');
  }
}

run();
