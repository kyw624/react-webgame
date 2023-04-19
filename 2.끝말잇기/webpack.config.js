const path = require('path');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = {
  name: 'word-relay-setting', // 웹팩 설정에 대한 이름
  mode: 'development', // 실서비스에서는 production
  devtool: 'eval', // 개발용. 빠르게 하겠다. / 실서비스에서는 hidden-source-map
  resolve: {
    extensions: ['.js', '.jsx'],
    // extensions 작성시 entry에 확장자를 안적어도 알아서 찾아줌.
  },
  // entry, output 제일 중요
  // entry: 입력 / output: 출력
  entry: {
    app: './client',
    // client에서 WordRelay를 이미 불러와서 적을 필요 없음. 알아서 처리됨.
  },
  module: {
    rules: [
      {
        test: /\.jsx?/, // js and jsx 파일들
        loader: 'babel-loader',
        options: {
          presets: [
            [
              '@babel/preset-env',
              {
                targets: { browsers: ['last 2 chrome versions'] },
                debug: true,
              },
            ],
            '@babel/preset-react',
          ],
          plugins: ['react-refresh/babel'],
        },
      },
    ],
  },
  plugins: [new ReactRefreshWebpackPlugin()],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'app.js',
    publicPath: '/dist',
  },
  devServer: {
    devMiddleware: { publicPath: '/dist' },
    static: { directory: path.resolve(__dirname) },
    hot: true,
  },
};
