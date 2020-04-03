const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    mode: "production",

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",
    entry: "./src/index.tsx",
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: "julenytt.js",
        library: 'Julenytt',
        libraryTarget: 'umd'
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'Production',
        }),
    ],
    externals: {
        react: 'React',
        'react-dom': 'ReactDOM'
    },
    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js"]
    },
    devServer: {
        stats: { colors: true },
        hot: true,
        port: 8090,
        open: true
    },
    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/, 
                use: [
                    { 
                        loader: "babel-loader",
                        options: {
                            presets: ['@babel/preset-env', '@babel/preset-react', "@babel/preset-typescript"],
                            plugins: [
                            ["@babel/plugin-proposal-class-properties", { "loose" : true }]
                            ]
                        } 
                    }   
                ]
            },
            {
                // include: path.resolve(__dirname, './node_modules/react-image-gallery/styles/scss/image-gallery.scss'),
                test:/\.(s*)css$/,
                use: [
                    { loader: 'style-loader', options: { injectType: 'singletonStyleTag' } },
                    { loader: 'css-loader' },
                    { loader: 'sass-loader' }
                ]
            },
            { 
                test: /\.(png|jpg|JPG|jpeg|gif|svg)$/, 
                use:[
                    { loader: "url-loader?limit=100000" },
                    { loader: "img-loader" }

                ]
            }
        ]
    }
};