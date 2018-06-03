/*
npm install --save-dev webpack webpack-cli webpack-merge babel-loader babel-plugin-add-module-exports
 */
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
// const date = new Date().toGMTString()

let commonConfig = {
	devtool: 'source-map',
	module: {
		rules: [{
			test: /\.js$/,
			exclude: /node_modules/,
			// include: [path.resolve(__dirname, 'src')],
			loader: 'babel-loader'
		},
			{
				test: /\.css$/,
				use: [
					"style-loader",
					"css-loader"
				]
			}
		]
	},
	plugins: [
		// new webpack.BannerPlugin({
		// 	banner: 'version' + date
		// })
	],
	mode: 'production'
};
let jsFiles = [
	// {
	// 	dir: 'assets/js',
	// 	name: 'common'
	// },
	// {
	// 	dir: 'assets/js',
	// 	name: 'yx-theme-config'
	// },
	{
		dir: 'fn-disqus',
		name: 'disqus'
	},
	{
		dir: 'fn-google-analytics',
		name: 'googleAnalytics'
	},
	{
		dir: 'fn-pre-loader',
		name: 'preLoader'
	},
	{
		dir: 'fn-preview-code',
		name: 'previewCode'
	},
	{
		dir: 'fn-qunit',
		name: 'qunit'
	},
	{
		dir: 'theme-fixed-toolbar',
		name: 'fixedToolbar'
	},
	{
		dir: 'theme-github-ribbon',
		name: 'githubRibbon'
	},
	{
		dir: 'theme-header-footer',
		name: 'headerFooter'
	},
	{
		dir: 'theme-header-footer/owl',
		name: 'owl'
	}
];
// jsFiles = [
// 	{
// 		dir: 'assets/js',
// 		name: 'yx-theme-config'
// 	}]
let fileConfigs = jsFiles.map((file) => {
	let filePath = './' + file.dir + '/';
	return {
		entry: filePath + file.name + '.js',
		output: {
			path: path.resolve(__dirname, filePath),
			filename: file.name + '.min.js'
		}
	}
});

module.exports = fileConfigs.map(info => merge(commonConfig, info));