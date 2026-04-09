const path = require("path");

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
