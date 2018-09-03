/** 
 * author:shenyuan
 * description:webpack4.4.1的配置
**/
const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const htmlPlugin = require('html-webpack-plugin');
const extractPlugin = require('extract-text-webpack-plugin'); // 分离css
const purifyCssPlugin = require('purifycss-webpack');   // 清除无用的css

const webpack_entry = require('./webpack_config/webpack.entry.js');
const webpack_module = require('./webpack_config/webpack.module.js');
const webpack_router = require('./webpack_config/webpack.router');

const htmlPluginArr = []
for (let item of webpack_router) {
    htmlPluginArr.push(
        new htmlPlugin({
            minify: {
                removeAttributeQuotes: true
            },
            hash: true,
            template: './src/template/' + item.html,
            filename: item.html,
            chunks: ['../assets/js/jquery.min', ...item.js]
        })
    );
}
if (process.env.type == "dev") {
    let publicPathStr = path.resolve(__dirname, 'dist').replace(/\\/g, '/') + '/';
    var website = {
        publicPath: publicPathStr
    }
    var pathUrl = path.resolve(__dirname, 'dist');
} else {
    var website = {
        publicPath: 'http://192.168.127.1:80/'
    }
    var pathUrl = path.resolve(__dirname, 'build');
}

const webpack_config = {
    mode: 'development',  //自动不压缩，不调用unglifyjs

    entry: webpack_entry,

    output: {
        path: pathUrl,
        filename: 'js/[name].js',
        publicPath: website.publicPath
    },

    module: webpack_module,

    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery"
        }),

        new extractPlugin('css/[name].css'),

        /* 必须配合extractPlugin插件一起使用 */
        new purifyCssPlugin({
            paths: glob.sync(path.join(__dirname, 'src/template/*.html'))
        }),

        new webpack.BannerPlugin('author:shenyuan,date:2018-04-04')
    ],

    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
        host: '192.168.127.1',
        compress: true, // 配置服务器压缩
        port: 80
    },
    watchOptions: {
        poll: 1000,
        aggregateTimeout: 500,
        ignored: /node_modules/
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                priority: false, // 缓存组优先级
                jquery: { // key 为entry中定义的 入口名称
                    chunks: "initial",
                    test: /node_modules/, // 正则规则验证，如果符合就提取 chunk
                    name: "../assets/js/jquery.min",
                    minSize: 0,
                    minChunks: 1,
                    enforce: true,
                    maxAsyncRequests: 5, // 最大异步请求数
                    maxInitialRequests: 5, // 最大初始化请求数
                    reuseExistingChunk: true
                }
            }
        }
    }
}
for (let item of htmlPluginArr) {
    webpack_config.plugins.push(item);
}
module.exports = webpack_config;