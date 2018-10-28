var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');
var webpack = require('webpack');

// check if make production 
var isProd = process.env.NODE_ENV === 'production';


module.exports = {
    entry: './src/app.js',
    target: 'web',
    devtool: 'source-map',
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: 'app.bundle.js',
        // publicPath: ' '
    },
    // webpack-dev-server config
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        // hot module reload
        hot: true,
        // compress: true,
        port: 8080,
        // cors for local file to serve with dev server
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": "true"
        },
        // less verbose output after compile
        stats: "errors-only",
        // open browsers
        open: true,
        // for remote client 
        disableHostCheck: true,
        // open browser bug fix for webpack 3
        openPage: ''
    },
    module: {
        rules: [{
                test: /\.js$/,
                include: [path.resolve(__dirname, 'src')],
                exclude: /(node_modules|bower_components)/,
                // import modules from three.js with es6 modules rule
                // but not working ===========. TODO
                // query: {
                //     compact: true,
                //     presets: [
                //         ['es2015', { modules: false }]
                //     ]
                // },
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }
            },
            // pre eslint code not working ============. TODO
            // {
            //     test: /\.js$/,
            //     enforce: 'pre',
            //     loader: 'eslint-loader',
            //     options: {
            //         emitWarning: true
            //     }
            // },
            //======== threejs shader hmr ====== MY
            // allow third-party glslify/browserify modules to work
            {
                test: /node_modules/,
                loader: 'ify-loader',
                // enforce: 'post'

            },
            // allow local glslify/browserify config to work
            {
                test: /\.js$/,
                loader: 'ify-loader',
                enforce: 'post'

            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "lohoLive Webclient",

            //mini html
            // minitfy: {
            //     collapseWhitespace: true
            // },
            // hash every changes of js file
            hash: true,
            template: './src/index.html'
        }),
        // hmr
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin()
    ]

}