import dotenv from 'dotenv';
import path from 'node:path';

const envPath: string = path.resolve(__dirname, '../../.env.test');
dotenv.config({ path: envPath });
