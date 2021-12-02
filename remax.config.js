const less = require('@remax/plugin-less');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  one: true,
  output: 'dist/' + process.env.REMAX_PLATFORM,
  plugins: [less()],
  configWebpack({ config, webpack }) {
    config.plugin('custom-define').use(webpack.DefinePlugin, [
      {
        BUILD_TIME: +new Date(),
      },
    ]);
    config.plugin('ignore').use(webpack.IgnorePlugin, [
            {
                resourceRegExp: /^\.\/api$/,
                contextRegExp: /@remax\/wechat\/esm$/,
            },
        ]);
    config.optimization.splitChunks({
      cacheGroups: {
        commons: {
          chunks: 'initial',
          name: 'remax-vendors',
          minChunks: 2,
          maxInitialRequests: 10, // The default limit is too small to showcase the effect
          minSize: 0, // This is example is too small to create commons chunks
          reuseExistingChunk: true, // 可设置是否重用该chunk（查看源码没有发现默认值）
        },
      },
    });
    config.devtool(false);
    config
      .when(process.env.NODE_ENV === 'development', (config) => {
        config.devtool('source-map');
      })
      .when(process.env.NODE_ENV === 'production', (config) => {
        config.optimization.minimize(true);
        config.plugin('js').use(new UglifyJSPlugin({}));
      });
    config.resolve.alias
      .merge({
        '@': resolve('src'),
      })
      .end();
  },
};
