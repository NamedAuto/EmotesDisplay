import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";

const config = {
    entry: path.resolve(__dirname, '../../src/frontend/index.ts'),
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, '../../dist/frontend'),
        publicPath: '/',
    },
    // context: path.resolve(__dirname, '../../src'),
    resolve: {
        extensions: ['.ts', '.js', '.yaml']
    },

    mode: 'development',
    devtool: 'inline-source-map',  // To get source maps for better debugging
    devServer: {
        static: [
            {
                directory: path.resolve(__dirname, '../../dist/frontend'),
            },
            {
                directory: path.resolve(__dirname, '../config'),
                publicPath: '/config',
            },
            {
                directory: path.resolve(__dirname, '../../public/background'),
                publicPath: '/background',
            }
        ],
        compress: true,
        port: 8080,
        hot: true,
        // historyApiFallback: {
        //     index: '/index.html', // Serve as the default file
        // },
        watchFiles: {
            paths: [
                'src/frontend/*.html',
                'src/frontend/**/*.html',
                'src/frontend/*.ts',
                'src/frontend/**/*.ts'],
            options: {
                usePolling: true,
            },
        },
        proxy: [
            {
                context: ['/emotes'], // Requests that match this path will be proxied
                target: 'http://localhost:8080',
                changeOrigin: true,
                pathRewrite: {'^/emotes': ''},
            },
            {
                context: ['/socket.io'], // Match socket.io requests
                target: 'http://localhost:8080',
                ws: true, // WebSocket proxying
            },
            {
                context: ['/api'],  // Which paths to proxy
                target: 'http://localhost:8080',  // Backend API URL
                changeOrigin: true,  // Modify the origin header
                secure: false,  // Disable SSL verification (if backend is HTTP)
            },
            {
                context: ['/config'],
                target: 'http://localhost:8080',
                changeOrigin: true,
                secure: false
            },
            {
                context: ['/background'],
                target: 'http://localhost:8080',
                changeOrigin: true,
                secure: false
            }
        ],
    },

    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.yaml$/,
                use: 'yaml-loader'
            }
        ],
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../../src/frontend/index.html'),
            filename: 'index.html',
            inject: 'body',
        })
    ],
};

export default config;