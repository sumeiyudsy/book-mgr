const path = require('path')

module.exports = {
  DEFAULT_PASSWORD: '12345',
  JWT_SECRET: 'book-mgr',
  UPLOAD_DIR: path.resolve(__dirname, '../upload'),
  SERVER_PORT: 80
}