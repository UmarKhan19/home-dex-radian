const path = require("path")
const webpack = require("webpack")

module.exports = {
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "bundle.js",
	},
	resolve: {
		fallback: {
			"fs": false,
			"constants": false,
			"querystring": false,
			"url": false,
			"path": false,
			"os": false,
			"http": require.resolve("http-browserify"),
			"https": require.resolve("https-browserify"),
			"zlib": require.resolve("browserify-zlib"),
			"stream": require.resolve("stream-browserify"),
			"crypto": require.resolve("crypto-browserify"),
		}
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
				loader: "babel-loader",
				options: {
					presets: ["@babel/preset-env", "@babel/preset-react"]
				}
				}
			},
			{
				test: /\.css$/,
				use: ["style-loader", "css-loader"]
			},
		]
	},
	plugins: [
		new webpack.ProvidePlugin({
			Buffer: ["buffer", "Buffer"],
			process: "process/browser"
		}),
	],
	devServer: {
		contentBase: path.join(__dirname, "public"),
		compress: true,
		port: 9000
	}
}
