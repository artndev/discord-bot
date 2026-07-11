import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { Database } from '@shared/types/database.types';
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!);
