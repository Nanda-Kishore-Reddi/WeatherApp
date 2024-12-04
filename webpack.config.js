const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './main.js', // Your entry file
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'), // This will create the `dist` folder
        clean: true, // Clears out old files in `dist` on each build
    },
    mode: 'development',
    module: {
        rules: [
            {
              test: /\.css$/i, // Match all `.css` files
              use: ['style-loader', 'css-loader'], // Apply these loaders
            },
          ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html', // Path to your HTML template
        }),
    ],
    devServer: {
        static: './dist',
        hot: true,
        open: true,
        port: 8080,
    },
};
