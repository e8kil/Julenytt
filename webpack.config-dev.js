const path = require("path")
module.exports = {
    entry: "./src/index.tsx",
    output: {
        path: path.resolve(__dirname, "./dist"),
        filename: "julenytt.js",
        library: "julenytt"
    },
    resolve: {
        alias: {
            node: path.resolve(__dirname, "./node_modules")
        },
        extensions: [".ts", ".tsx", ".js"]
    },
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.ts(x)?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            presets: ["@babel/preset-env", "@babel/preset-react", "@babel/preset-typescript"],
                            plugins: [["@babel/plugin-proposal-class-properties", { loose: true }]]
                        }
                    }
                ]
            },
            {
                test: /\.(s*)css$/,
                use: [{ loader: "style-loader", options: { injectType: "singletonStyleTag" } }, { loader: "css-loader" }, { loader: "sass-loader" }]
            },
            { test: /\.(png|jpg|jpeg|gif|svg)$/, loader: "url-loader?limit=100000" },
            {
                test: /\.ts(x)?$/, 
                loader: 'string-replace-loader',
                options: {
                  multiple: [
                     { search: '\#\{apiUrl\}', replace: 'http://localhost:3000', flags: 'g' },            
                  ]
                }
            },
        ]
    },
    devServer: {
        stats: { colors: true },
        hot: true
    }
}
