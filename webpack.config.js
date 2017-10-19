var debug = process.env.NODE_ENV !== "production";
const analyzer = process.env.NODE_ENV === 'analyzer'
const prod = process.env.NODE_ENV === 'prod'
const webpack = require('webpack')
const path = require('path')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const ExtractTextPlugin = require('extract-text-webpack-plugin')
let config = {
    context: path.join(__dirname),
    devtool: debug ? 'eval-source-map' : false,
    entry: {
        bundle: './src/root.js'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader',
                options: {
                    presets: ['react', ['es2015', {'modules': false}], 'stage-0'],
                    plugins: ['react-html-attrs', 'transform-runtime', ['import', [{
                        'libraryName': 'antd',
                        'libraryDirectory': 'lib',
                        'style': 'css'
                    }]]] //添加组件的插件配置
                }
            },
            //下面是使用 ant-design 的配置文件
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader'
                })
            }
        ]
    },
    output: {
        path: __dirname,
        filename: './src/bundle.js'//chunkhash:5
    },
    plugins: debug ? [] : [
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        }),
        // new webpack.optimize.UglifyJsPlugin()
        new webpack.optimize.UglifyJsPlugin({
            beautify: false,
            comments: false,
            compress: {
                warnings: false,
                drop_console: true,
                // 内嵌定义了但是只用到一次的变量
                collapse_vars: true,
                // 提取出出现多次但是没有定义成变量去引用的静态值
                reduce_vars: true,
                unused: true
            }
        }),
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn/)
    ],
    // devServer: {//调试时使用代理
    //     contentBase: './',
    //     open: true,
    //     compress: true,
    //     historyApiFallback: true,
    //     host: '192.168.1.83',
    //     port: '8080'
    // }
}

// console.log(process.env.NODE_ENV, debug, analyzer, prod)

config.plugins.push(new ExtractTextPlugin('./src/assets/css/antd.min.css'))

analyzer?config.plugins.push(new BundleAnalyzerPlugin()) :''

module.exports = config
