import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Starting Python calculator server...');

const pythonServer = spawn('python', [join(__dirname, 'server.py')], {
  stdio: 'inherit',
  shell: true
});

pythonServer.on('error', (error) => {
  console.error('Failed to start Python server:', error);
  process.exit(1);
});

pythonServer.on('close', (code) => {
  console.log(`Python server process exited with code ${code}`);
  process.exit(code);
});

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log('\nShutting down Python server...');
  pythonServer.kill('SIGINT');
});

process.on('SIGTERM', () => {
  pythonServer.kill('SIGTERM');
});
