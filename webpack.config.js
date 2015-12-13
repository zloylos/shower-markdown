var webpack = require('webpack');
var path = require('path');

module.exports = {
    entry: {
        'shower-markdown': path.resolve(__dirname, './index.js'),
    },
    output: {
        path: './',
        filename: 'shower-markdown.js'
    },
    module: {
        loaders: [
            {
                test: /\.json$/,
                loader: 'json-loader'
            }
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {warnings: false},
            output: {comments: false}
        })
    ]
};
