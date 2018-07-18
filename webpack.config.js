const PUBLIC_PATH = require('path').join(__dirname, 'public');
const { initBackendStub } = require('./utils/backend-stub');

module.exports = {
  mode: 'development',  //удалил свойство entry, т.к. оно и так использует настройку по умолчанию
  output: {
    path: PUBLIC_PATH,
    filename: 'index.js'
  },
  devServer: {
    contentBase: PUBLIC_PATH,
    compress: true,
    port: 9000,
    before: initBackendStub
  }
};
