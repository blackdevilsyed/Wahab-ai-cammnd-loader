const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'database');
if (!fs.existsSync(DB_PATH)) {
  fs.mkdirSync(DB_PATH, { recursive: true });
}

module.exports = {
  // Database logic is minimized because extra features are removed.
  // We keep this structure intact just in case future commands need a basic DB format.
  getGroupSettings: () => ({}),
  getUser: () => ({}),
  isModerator: () => false
};
