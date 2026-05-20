import { Client } from 'pg';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env' });

async function run() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log('Connected to DB!');
    
    // Update query
    const result = await client.query(`
      UPDATE guest 
      SET "isInviteRSVP" = true 
      WHERE id IN (
        SELECT DISTINCT "guest" 
        FROM guest_timeline 
        WHERE action IN ('GUEST_ACCEPTED_INVITE', 'GUEST_REJECTED_INVITE')
      ) AND "isInviteRSVP" = false;
    `);
    
    console.log(`Updated ${result.rowCount} guest records.`);
    
  } catch (error) {
    console.error(error);
  } finally {
    await client.end();
  }
}

run();
