const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logFile = path.join(logDir, 'app.log');

function write(level, msg) {
  const line = `${new Date().toISOString()} [${level}] ${msg}\n`;
  try {
    fs.appendFileSync(logFile, line);
  } catch (e) {
    // fallback to console if file write fails
    console.error('Failed to write log file:', e);
  }
  if (level === 'ERROR') console.error(line);
  else console.log(line);
}

module.exports = {
  info: (msg) => write('INFO', String(msg)),
  error: (msg) => write('ERROR', String(msg)),
};
