const jwt = require('jsonwebtoken');
const crypto = require('crypto');
function generateAccessToken(username) {
  return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
}
