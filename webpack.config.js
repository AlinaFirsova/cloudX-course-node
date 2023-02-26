const slsw = require("serverless-webpack");
const webpack = require("webpack");

module.exports = {
  entry: slsw.lib.entries,
  target: "node",
  plugins: [new webpack.IgnorePlugin({ resourceRegExp: /^pg-native$/ })],
  module: {
    rules: [
      {
        loader: "babel-loader",
        exclude: /node_modules/,
      },
    ],
  },
};
