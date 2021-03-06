/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const fluidRoute = require("@microsoft/fluid-webpack-component-loader");
const path = require("path");
const merge = require("webpack-merge");

const pkg = require("./package.json");
const componentName = pkg.name.slice(1);

module.exports = env => {
    const isProduction = env && env.production;

    return merge({
        entry: {
            main: "./src/index.ts",
        },
        resolve: {
            extensions: [".ts", ".tsx", ".js"],
        },
        module: {
            rules: [{
                test: /\.tsx?$/,
                loader: "ts-loader",
            }]
        },
        output: {
            filename: "[name].bundle.js",
            path: path.resolve(__dirname, "dist"),
            library: "[name]",
            // https://github.com/webpack/webpack/issues/5767
            // https://github.com/webpack/webpack/issues/7939
            devtoolNamespace: componentName,
            libraryTarget: "umd",
        },
        devServer: {
            publicPath: '/dist',
            stats: "minimal",
            before: (app, server) => fluidRoute.before(app, server),
            after: (app, server) => fluidRoute.after(app, server, __dirname, env),
        }
    }, isProduction
        ? require("./webpack.prod")
        : require("./webpack.dev"));
};
