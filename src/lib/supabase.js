import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://inusekkhuvkuixfmsxqf.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImludXNla2todXZrdWl4Zm1zeHFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2Njg2OTMsImV4cCI6MjA3NjI0NDY5M30.1_CPqX-WZXE_HkoSBm6iKzl1YzORmg8HTfGt0b6jmkI";

export const supabase = createClient(supabaseUrl, supabaseKey);
