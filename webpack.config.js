const path = require('path');
const webpack = require('webpack');
const prod = process.env.NODE_ENV === 'production';

module.exports = {
    entry: {
        bar: [
            'es6-promise',
            path.join(__dirname, 'public/js/viz.bar.js')
        ],
        break: [
            'es6-promise',
            path.join(__dirname, 'public/js/viz.break.js')
        ],
        clusters: [
            'es6-promise',
            path.join(__dirname, 'public/js/viz.clusters.js')
        ]
    },

    output: {
        path: path.join(__dirname, 'public/js/'),
        filename: 'viz.[name].bundle.js',
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
