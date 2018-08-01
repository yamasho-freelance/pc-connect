const path = require('path');

module.exports = {
    // モード値を production に設定すると最適化された状態で、
    // development に設定するとソースマップ有効でJSファイルが出力される
    mode: 'development',
    devtool: 'inline-source-map',
   
    // メインとなるJavaScriptファイル（エントリーポイント）
    entry: ['babel-polyfill', './src/components/index.js'],

    output: {
        // 出力するファイル名
        filename: 'bundle.js',
        // 出力先のパス（v2系以降は絶対パスを指定する必要がある）
        path: path.join(__dirname, 'dest')
    },
   
    module: {
      rules: [
        {
          // 拡張子 .js の場合
          test: /\.js$/,
          exclude: /node_modules/, // node_modulesフォルダ配下は除外
          use: [
            {
              // Babel を利用する
              loader: 'babel-loader',
              // Babel のオプションを指定する
              query: {
                plugins: ["transform-react-jsx","babel-plugin-transform-decorators-legacy"] // babelのtransform-react-jsxプラグインを使ってjsxを変換
                , presets: [
                  // env を指定することで、ES2018 を ES5 に変換。
                  // {modules: false}にしないと import 文が Babel によって CommonJS に変換され、
                  // webpack の Tree Shaking 機能が使えない
                  ['env', {'modules': false}],
                  // React の JSX を解釈
                  'react'
                ]
              }
            }
          ]
        }
      ]
    }
  };
  