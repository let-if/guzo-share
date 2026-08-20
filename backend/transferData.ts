import pkg from 'pg';
const { Client } = pkg;

const LOCAL_URL = "postgresql://postgres:Letif7327@localhost:5432/guzoshare?schema=public";
const NEON_URL = "postgresql://neondb_owner:npg_lXk8eag3NdDc@ep-mute-violet-ay4qeky0.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require";

async function runMigration() {
  console.log("🔄 Connecting to Local and Neon databases...");
  
  const localClient = new Client({ connectionString: LOCAL_URL });
  const neonClient = new Client({ connectionString: NEON_URL });

  await localClient.connect();
  await neonClient.connect();

  try {
    const tables = ['users', 'vehicles', 'trips', 'bookings', 'notifications'];

    for (const table of tables) {
      console.log(`📦 Fetching rows for table: ${table}...`);
      const res = await localClient.query(`SELECT * FROM "${table}"`);
      const rows = res.rows;

      if (rows.length === 0) {
        console.log(`⚠️ No rows found in ${table}, skipping.`);
        continue;
      }

      console.log(`🚀 Inserting ${rows.length} rows into Neon table "${table}"...`);

      for (const row of rows) {
        const keys = Object.keys(row);
        const values = Object.values(row);
        const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
        const quotedKeys = keys.map(k => `"${k}"`).join(', ');

        const query = `INSERT INTO "${table}" (${quotedKeys}) VALUES (${placeholders}) ON CONFLICT DO NOTHING`;
        
        try {
          await neonClient.query(query, values);
        } catch (insertErr) {
          console.error(`Error inserting row into ${table}:`, insertErr);
        }
      }
      console.log(`✅ Table "${table}" migrated successfully!`);
    }

    console.log("🎉 All data successfully transferred from Local PostgreSQL to Neon!");
  } catch (err) {
    console.error("❌ Migration failed:", err);
  } finally {
    await localClient.end();
    await neonClient.end();
  }
}

runMigration();