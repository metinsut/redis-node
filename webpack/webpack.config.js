const webpackNodeExternals = require("webpack-node-externals");

module.exports = {
   target: "node",
   entry: "./index.js",
   externals: [webpackNodeExternals()]
};
