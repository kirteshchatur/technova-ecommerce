import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('⚡ Starting TECHNOVA Platform (Backend + Frontend)...');

const backend = spawn('node', ['src/server.js'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit',
  env: { ...process.env, PORT: '5001' }
});

const frontend = spawn('npx', ['vite', '--host'], {
  cwd: path.join(__dirname, 'frontend'),
  stdio: 'inherit',
  env: process.env
});

function cleanup() {
  console.log('\n🛑 Shutting down TECHNOVA servers...');
  try { backend.kill(); } catch {}
  try { frontend.kill(); } catch {}
  process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

backend.on('exit', (code) => {
  if (code !== 0 && code !== null) {
    console.error(`Backend exited with code ${code}`);
  }
});

frontend.on('exit', (code) => {
  if (code !== 0 && code !== null) {
    console.error(`Frontend exited with code ${code}`);
  }
});
