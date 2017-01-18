const path = require('path');
const webpack = require('webpack');
const prod = process.env.NODE_ENV === 'production';

module.exports = {
    entry: {
        viz: [
            'es6-promise',
            path.join(__dirname, 'public/js/viz.js')
        ]
    },

    output: {
        path: path.join(__dirname, 'public/js/'),
        filename: '[name].bundle.js',
        /* path root for imports */
        publicPath: __dirname
    },

    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: [
                        'es2015',
                        'stage-0'
                    ]
                }
            }
        ]
    },

    resolve: {
        modules: [__dirname, path.join(__dirname, '/node_modules')],
        extensions: [
            '.js'
        ]
    }
};
