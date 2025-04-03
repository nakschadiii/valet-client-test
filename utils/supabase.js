const { createClient } = require('@supabase/supabase-js');
require('dotenv/config').config
const { SUPABASE_DB_API_KEY : key, SUPABASE_DB_URL : url } = process.env;
const supabase = createClient(url, key);

module.exports = supabase;