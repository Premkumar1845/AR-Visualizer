import app from './app.js';
import { env, isSupabaseConfigured } from './config/env.js';

app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`\n  ▲ AR-Visualizer API`);
    console.log(`  ├ env       ${env.nodeEnv}`);
    console.log(`  ├ port      ${env.port}`);
    console.log(`  ├ client    ${env.clientOrigin}`);
    console.log(`  └ supabase  ${isSupabaseConfigured ? 'connected' : 'NOT configured — running in fallback mode'}\n`);
});
