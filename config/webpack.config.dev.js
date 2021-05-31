
var autoprefixer = require('autoprefixer')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
var InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin')
var WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin')
var getClientEnvironment = require('./env')
var paths = require('./paths')
var path = require('path')

var publicPath = '/'
var publicUrl = ''
var env = getClientEnvironment(publicUrl)

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: [
    require.resolve('react-dev-utils/webpackHotDevClient'),
    require.resolve('./polyfills'),
    paths.appIndexJs
  ],
  output: {
    path: paths.appBuild,
    pathinfo: true,
    filename: 'static/js/bundle.js',
    publicPath: publicPath
  },
  resolve: {
    modules: [path.resolve(__dirname, '../src'), path.resolve(__dirname, '../public'), 'node_modules'], 
    extensions: ['.js', '.json', '.jsx'],
    alias: {
      'react-native': 'react-native-web',
    }
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        loader: 'eslint-loader',
        enforce: "pre",
        include: paths.appSrc
      },
      {
        exclude: [
          /\.html$/,
          /\.(js|jsx)$/,
          /\.css$/,
          /\.json$/,
          /\.svg$/
        ],
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: 'static/media/[name].[hash:8].[ext]'
        }
      },
      {
        test: /\.(js|jsx)$/,
        include: paths.appSrc,
        loader: 'babel-loader',
        query: {
          cacheDirectory: true
        }
      },
      {
        test: /\.css$/,
        include: paths.appSrc,
        exclude: path.resolve(__dirname, '../src/components/Editor'),
        use: [
          {
            loader: 'style-loader',
            options: {
              sourceMap: true,
            }
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName:'[path]___[name]__[local]___[hash:base64:5]',
            }
          },
          {
            loader: 'postcss-loader',
            options: {
                ident: 'postcss',
                plugins: () => [
                    require('postcss-flexbugs-fixes'),
                    autoprefixer({
                        browsers: [
                            '>1%',
                            'last 4 versions',
                            'Firefox ESR',
                            'not ie < 9',
                        ],
                        flexbox: 'no-2009',
                    }),
                    require('postcss-modules-values'),
                ],
            },
          }
        ]
      },
      {
        test: /\.css$/,
        include: [paths.appNodeModules, paths.appPublic, path.resolve('./src/components/Editor')],
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            }
          },
          {
            loader: 'postcss-loader',
            options: {
                ident: 'postcss',
                plugins: () => [
                    require('postcss-flexbugs-fixes'),
                    autoprefixer({
                        browsers: [
                            '>1%',
                            'last 4 versions',
                            'Firefox ESR',
                            'not ie < 9',
                        ],
                        flexbox: 'no-2009',
                    }),
                    require('postcss-modules-values'),
                ],
            },
          }
        ]
      },
      {
        test: /\.svg$/,
        loader: 'file-loader',
        query: {
          name: 'static/media/[name].[hash:8].[ext]'
        }
      }
    ]
  },
  plugins: [
    new InterpolateHtmlPlugin({
      PUBLIC_URL: publicUrl
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml
    }),
    new ExtractTextPlugin("styles.css"),
    new webpack.DefinePlugin(env),
    new webpack.HotModuleReplacementPlugin(),
    new CaseSensitivePathsPlugin(),
    new WatchMissingNodeModulesPlugin(paths.appNodeModules),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      //'signalR': 'assets/js/signalr-clientES5.js',
      'Hub': 'assets/js/chatsHub.js'
    }),
  ],
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }
}
