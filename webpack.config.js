const path = require("path");
const webpack = require("webpack");
const fs = require("fs");

const PACKAGE_JSON = path.resolve(__dirname, "package.json");

const isProduction = process.env.SOURCEMAP === "false";

module.exports = {
  mode: isProduction ? "production" : "development",
  devtool: isProduction ? false : "inline-source-map",
  entry: {
    main: "./src/ts/index.ts",
  },
  output: {
    path: path.resolve(__dirname, "./build"),
    filename: "index.js",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    modules: [
      path.join(__dirname, "./src/ts"),
      path.join(__dirname, "./node_modules"),
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      __VERSION__: webpack.DefinePlugin.runtimeValue(
        () => JSON.stringify(JSON.parse(fs.readFileSync(PACKAGE_JSON, "utf8")).version),
        { fileDependencies: [PACKAGE_JSON] },
      ),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        options: {
          experimentalWatchApi: true,
        },
      },
    ],
  },
};
