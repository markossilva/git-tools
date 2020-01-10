const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('./webpack.config');
const http = require('http');

module.exports = () => {
  const app = express();

  config.plugins = [
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify(process.env.NODE_ENV) },
    }),
  ];

  config.plugins.push(new webpack.HotModuleReplacementPlugin());
  config.plugins.push(new webpack.NoEmitOnErrorsPlugin());

  config.entry = ['webpack-hot-middleware/client?path=http://localhost:3000/__webpack_hmr&reload=true', config.entry];

  const compiler = webpack(config);

  const statusConf = {
    colors: true,
    hash: false,
    timings: true,
    chunks: false,
    chunkModules: false,
    modules: false,
  };

  const middlewareConfig = {
    publicPath: config.output.publicPath,
    contentBase: 'src',
    stats: statusConf,
  };

  const middleware = webpackMiddleware(compiler, middlewareConfig);

  app.use(middleware);

  app.use(webpackHotMiddleware(compiler));

  app.use(express.static(__dirname));

  app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
  const server = http.createServer(app);
  server.listen(3000, err => {
    if (err) {
      console.error(err);
    }
    console.info('==> Listening on port 3000');
  });
};
