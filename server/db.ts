import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;


export const pool = new Pool({ connectionString: 'postgresql://neondb_owner:npg_z9ILyxeg0sJY@ep-proud-river-a88ensbs-pooler.eastus2.azure.neon.tech/neondb?sslmode=require' });
export const db = drizzle({ client: pool, schema });
