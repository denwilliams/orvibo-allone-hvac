const config = require('./config');
const profiles = {};

config.get('profiles').forEach(p => {
  profiles[p.id] = p.mode;
});

module.exports = profiles;
