const path = require("path");

module.exports = {
  mode: "development",
  devtool: "inline-source-map",
  entry: {
    main: "./src/ts/index.ts",
  },
  output: {
    path: path.resolve(__dirname, "./build"),
    filename: "index.js",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    modules: [path.join(__dirname, "./src/ts"), path.join(__dirname, "./node_modules")],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
      },
    ],
  },
};
