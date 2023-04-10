const path = require('path');
const glob = require('glob');

module.exports = {
  entry: glob.sync('./src/*.tsx').reduce((entries, file) => {
    const name = path.basename(file, '.tsx');
    entries[name] = "./"+file;
    return entries;
  }, {}),
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                [
                  '@babel/preset-react',
                  {
                    runtime: 'automatic'
                  }
                ]
              ]
            }
          },
          'ts-loader'
        ],
        exclude: /node_modules/,
        parser: {
          amd: true // enable AMD support
        }
      
      },
    ],

    
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'public/js'),
  },
};