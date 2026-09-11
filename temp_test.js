const fs = require('fs');
global.window = { ENV: {} };
global.document = { addEventListener: () => {} };
global.console = console;

const supabaseUrl = 'https://supabase.alpine-korea.co.kr';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsZ2pnd29yc2VsdmthYXRkZnR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4MTE4MTUsImV4cCI6MjA4NzM4NzgxNX0.GUiDsLVI3UNZdr8i5aQtSYkt44vqbrZ1OcuoYWzp7us';

// Mock Supabase CDN
global.supabase = {
    createClient: (url, key, opts) => {
        return {
            schema: (s) => ({
                from: (table) => ({
                    select: () => ({
                        eq: () => ({
                            order: () => Promise.resolve({ data: [{ id: 1, name: 'mock' }], error: null })
                        }),
                        order: () => Promise.resolve({ data: [{ id: 1, name: 'mock' }], error: null })
                    }),
                    upsert: () => Promise.resolve({}),
                    delete: () => ({ eq: () => Promise.resolve({}) })
                })
            })
        }
    }
};

const authJs = fs.readFileSync('js/auth.js', 'utf8');
const clientJs = fs.readFileSync('js/supabase-client.js', 'utf8');

// evaluate auth.js
try {
    eval(authJs);
} catch (e) {
    console.error('Error evaluating auth.js:', e);
}

// evaluate supabase-client.js
try {
    eval(clientJs);
} catch (e) {
    console.error('Error evaluating supabase-client.js:', e);
}

async function test() {
    try {
        const result = await fetchDealerList();
        console.log('Dealer list length:', result ? result.length : null);
    } catch (e) {
        console.error('Error running fetchDealerList:', e);
    }
}
test();
