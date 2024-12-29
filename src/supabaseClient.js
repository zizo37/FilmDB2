import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dzztqaghfzbdepqjpvkn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6enRxYWdoZnpiZGVwcWpwdmtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUxNjY1NzMsImV4cCI6MjA1MDc0MjU3M30.4MSnpBef8oe40jbCUzzaP2gtnoI6C42ziWNzos6CFGw';

export const supabase = createClient(supabaseUrl, supabaseKey);