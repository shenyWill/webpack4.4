const extractPlugin = require('extract-text-webpack-plugin'); // 分离css
const webpack_module = {
    rules:[
        {
            test:/\.css$/,
            use:extractPlugin.extract(
                {
                    fallback: "style-loader",
                    use: [
                        {
                            loader:'css-loader',
                            options:{
                                minimize: true //css压缩
                                // importLoaders:1
                            }
                        },
                        'postcss-loader'
                    ]
                }
            )
        },
        {
            test:/\.(png|jpg|gif)/,
            use:[
                {
                    loader:'url-loader',
                    options:{
                        limit:5000,
                        outputPath:'images/'
                    }
                }
            ]
        },
        {
            test:/\.(html|htm)$/i,
            use:['html-withimg-loader']
        },
        {
            test:/\.scss$/,
            use:extractPlugin.extract(
                {
                    use:[
                        {
                            loader:'css-loader',
                            options:{
                                minimize: true //css压缩
                                // importLoaders:1
                            }
                        },
                        {
                            loader:'sass-loader'
                        },
                        'postcss-loader'
                    ],
                    fallback:'style-loader'
                }
            )
        },
        {
            test:/\.js$/,
            use:{
                loader:'babel-loader'
            },
            exclude:/node_modules/
        }
    ]
}
module.exports = webpack_module;