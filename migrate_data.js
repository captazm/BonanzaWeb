import { createClient } from '@supabase/supabase-js';
import { products } from './src/data/products.js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrate() {
    console.log('Migrating products...');
    const { error } = await supabase.from('products').upsert(products);
    if (error) {
        console.error('Error migrating products:', error);
    } else {
        console.log('Successfully migrated products!');
    }
}

migrate();
