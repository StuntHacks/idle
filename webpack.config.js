const path = require("path");

module.exports = {
  mode: "production",
  devtool: process.env.SOURCEMAP === "false" ? false : "source-map",
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
