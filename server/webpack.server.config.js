const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    name: "server",
    mode: "development",

    entry: {
        server: ["@babel/polyfill", "./src/index.ts"]
    },

    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: '/',
        filename: "[name].js"
    },

    target: 'node',

    externals: [nodeExternals()],

    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env'
                        ],
                        plugins: [
                            "babel-plugin-transform-typescript-metadata",
                            ["@babel/plugin-proposal-decorators", { "legacy": true }],
                            '@babel/plugin-proposal-class-properties',
                            '@babel/plugin-proposal-logical-assignment-operators',
                            '@babel/plugin-proposal-optional-chaining'
                        ]
                    }
                }
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            '@babel/preset-typescript'
                        ],
                        plugins: [
                            "babel-plugin-transform-typescript-metadata",
                            ["@babel/plugin-proposal-decorators", { "legacy": true}],
                            '@babel/plugin-proposal-class-properties',
                            '@babel/plugin-proposal-logical-assignment-operators',
                            '@babel/plugin-proposal-optional-chaining'
                        ]
                    }
                }
            }
        ]
    }
}