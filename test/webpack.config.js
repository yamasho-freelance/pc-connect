const path = require('path');

module.exports = {
    // モード値を production に設定すると最適化された状態で、
    // development に設定するとソースマップ有効でJSファイルが出力される
    mode: 'development',
   
    // メインとなるJavaScriptファイル（エントリーポイント）
    entry: './src/ts/app.1.ts',

    output: {
        // 出力するファイル名
        filename: 'bundle.js',
        // 出力先のパス（v2系以降は絶対パスを指定する必要がある）
        path: path.join(__dirname, 'dest/js')
    },
   
    module: {
      rules: [
        {
          // 拡張子 .js の場合
          test: /\.ts$/,
          include:[
            path.resolve(__dirname, "node_modules"),
          ],
          use: [
            {
              // Babel を利用する
              loader: 'babel-loader',
              // Babel のオプションを指定する
              options: {
                presets: [
                  // env を指定することで、ES2017 を ES5 に変換。
                  // {modules: false}にしないと import 文が Babel によって CommonJS に変換され、
                  // webpack の Tree Shaking 機能が使えない
                  ['env', {'modules': false}]
                ]
              }
            },
            {
             loader: 'ts-loader'
            }
          ]
        },
        {
            // 拡張子 .js の場合
            test: /\.js$/,
            use: [
              {
                // Babel を利用する
                loader: 'babel-loader',
                // Babel のオプションを指定する
                options: {
                  presets: [
                    // env を指定することで、ES2017 を ES5 に変換。
                    // {modules: false}にしないと import 文が Babel によって CommonJS に変換され、
                    // webpack の Tree Shaking 機能が使えない
                    ['env', {'modules': false}]
                  ]
                }
              }
            ]
          }
      ]
    }
  };
  