var path = require('path')

module.exports = {
    entry: [path.join(__dirname, 'index')],
    devtool: 'inline-source-map', //just do inline source maps instead of the default
    output: {
        path: path.join(process.cwd(), 'dist'),
        filename: 'app.bundle.js',
    },
    resolve: {
        modules: [
            __dirname,
            path.join(__dirname, 'client'),
            path.join(__dirname, 'node_modules/superdesk-core/styles/sass'),
            'node_modules'
        ],
        extensions: ['.js', '.jsx', '.json'],
        alias: {
            images: path.resolve(__dirname, 'node_modules/superdesk-core/images'),
            apps: path.resolve(__dirname, 'node_modules/superdesk-core/scripts/apps')
        }
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                loader: 'html-loader'
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.json$/,
                use: ['json-loader']
            },
            {
                enforce: 'post',
                test: /\.jsx?/,
                loader: 'istanbul-instrumenter-loader',
                exclude: [
                    /node_modules\//,
                    /client\/index\.js/,
                    /_test\.jsx?/,
                    /tests\.js/,
                    /client\/controllers\//
                ]
            },
            {
                test: /\.(png|gif|jpeg|jpg|woff|woff2|eot|ttf|svg)(\?.*$|$)/,
                loader: 'file-loader'
            }
        ],
    }
}
