const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    mode: 'none',
    entry : ['./src/index.js'],
    output : {
        filename : 'bundle.js',
        path : path.resolve(__dirname, 'output')
    },
    module : {
        rules : [
            {
                test : /src\.js$/,
                exclude : /(node_modules|bower_components)/,
                use : {
                    loader : 'babel-loader',
                    options : {
                        presets : [ 'env' ]
                    }
                }
            },
            {
              test: /(\.glsl$|\.vert$|\.frag$)/,
              loader: 'webpack-glsl-loader'
            }
        ]
    },
      plugins: [
        new UglifyJSPlugin()
    ]
};
