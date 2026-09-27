import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pfocbrctqtkfanidikvv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmb2NicmN0cXRrZmFuaWRpa3Z2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1NDgwOTIsImV4cCI6MjA5ODEyNDA5Mn0.yqh0we7VWJrn7P025OYZEVEO5n5Urd7pWdCaBaQ7x5Y';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);