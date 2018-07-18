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
			use: [
				'babel-loader'
			]
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
	mode: 'production'
};
let jsFiles = [
	{
		dir: 'assets/js',
		name: 'common',
		library: 'YX',
		libraryTarget: 'umd'
	},
	{
		dir: 'assets/js',
		name: 'yx-theme-config',
		library: 'siteConfig',
		libraryTarget: 'umd'
	},
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
		name: 'preLoader',
		library: 'PreLoader'
	},
	{
		dir: 'fn-preview-code',
		name: 'previewCode',
		library: 'previewCode',
		libraryTarget: 'umd'
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
		name: 'headerFooter',
		library: 'HeaderFooter',
		libraryTarget: 'umd'
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
			filename: file.name + '.min.js',
			library: file.library,
			libraryTarget: file.libraryTarget
		}
	}
});

module.exports = fileConfigs.map(info => merge(commonConfig, info));