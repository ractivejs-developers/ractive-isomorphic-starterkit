'use strict';

const webpack = require('webpack');
const path = require('path');

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const RuntimeAnalyzerPlugin = require('webpack-runtime-analyzer');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const WrapperPlugin = require('wrapper-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');

const ENV = process.env.NODE_ENV || 'development';
const VERSION = require('./package.json').version;

module.exports = function(env) {
	env = env || ENV;

	const DEBUG = (env !== 'production');

	return {
		performance: {
			hints: 'warning',
		},
		cache: true,
		resolve: {
			extensions: ['.js', '.json'],
			mainFields: ['browser', 'main'],
		},
		devtool: (DEBUG ? 'cheap-eval-source-map' : false),
		entry: {
			app: [
				path.resolve(__dirname, 'src/app'),
			]
		},
		output: {
			path:           path.resolve(__dirname, 'dist'),
			publicPath:     '/',
			filename:       `[name]-${ VERSION }.bundle.[hash].js`,
			chunkFilename:  `[name]-${ VERSION }.bundle.[chunkhash].js`,
		},
		module: {
			rules: [
				{
					test: /\.(js)$/,
					exclude: /(node_modules|bower_components)/,
					loader: 'babel-loader',
				},
				{
					test: /\.(scss|css)$/,
					use: ExtractTextPlugin.extract({
						use: [
							{
								loader: 'css-loader',
								options: {
									modules: true,
									importLoaders: 2,
									camelCase: true,
									sourceMap: true,
									localIdentName: '[folder]__[local]___[hash:base64:5]'
								}
							},
							{
								loader: 'sass-loader',
								options: {
									sourceMap: true,
									outputStyle: 'expanded',
									includePaths: path.resolve(__dirname, 'assets')
								}
							},
							{
								loader: 'postcss-loader'
							}
						],
						fallback: 'style-loader'
					})
				},
				{
					test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
					loader: 'url-loader',
					options: {
						limit: 10000
					}
				},
			]
		},
		plugins: [
			new webpack.NoEmitOnErrorsPlugin(),
			new webpack.LoaderOptionsPlugin({
				minimize: true,
				debug: DEBUG,
			}),
			new webpack.DefinePlugin({
				'process.env': JSON.stringify(process.env),
				'VERSION': JSON.stringify(VERSION),
			}),
			new webpack.optimize.ModuleConcatenationPlugin(),
			new WrapperPlugin({
				test: /\app(.*).js$/,
				header: '(function(){"use strict";\nreturn\t',
				footer: '\n})()();'
			}),
			new UglifyJSPlugin({
				sourceMap: DEBUG,
				uglifyOptions: {
					comments: DEBUG,
					compress: {
						warnings: DEBUG,
						drop_console: !DEBUG
					}
				},
			}),
			new ExtractTextPlugin('styles.[contenthash].css'),
			new ManifestPlugin({
				fileName: 'webpack-asset-manifest.json'
			}),
			new webpack.NamedModulesPlugin(),
			new HtmlWebpackPlugin({
				template: './views/_index.html',
				filename: '../views/index.html',
				minify: {
					html5: true
				},
				hash: true,
				cache: true,
				showErrors: false,
			}),
			new CleanWebpackPlugin(['dist']),
			new CompressionPlugin({
				asset: '[path].gz[query]',
				algorithm: 'gzip',
				test: /\.js$|\.css$/,
				threshold: 10240,
				minRatio: 0.8,
			}),
			new webpack.optimize.CommonsChunkPlugin({
				name: 'vendor',
				minChunks: ({ resource }) => (
					resource !== undefined &&
					resource.indexOf('node_modules') !== -1
				)
			}),
			new webpack.optimize.CommonsChunkPlugin({
				name: 'main',
				children: true,
				async: true,
				minChunks: ({ resource }) => (
					resource !== undefined &&
					resource.indexOf('node_modules') !== -1
				)
			}),
			new webpack.optimize.CommonsChunkPlugin({
				name: 'manifest',
				minChunks: Infinity
			}),
			new CopyWebpackPlugin([{
				from: 'assets',
				force: true
			}]),
			new WebpackMd5Hash(),
			DEBUG && new BundleAnalyzerPlugin({
				analyzerMode: 'static',
				defaultSizes: 'gzip',
				openAnalyzer: false,
			}),
			DEBUG && new RuntimeAnalyzerPlugin({
				mode: 'standalone',
				port: 0,
				open: true,
				watchModeOnly: true,
			}),
		].filter(Boolean)
	};
};