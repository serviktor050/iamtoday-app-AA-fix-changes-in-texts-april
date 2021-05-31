
// var autoprefixer = require('autoprefixer')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var UglifyJsPlugin = require('uglifyjs-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var ManifestPlugin = require('webpack-manifest-plugin')
var InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin')
var url = require('url')
var paths = require('./paths')
var getClientEnvironment = require('./env')
const path = require('path')
const context = path.resolve(__dirname, 'src')

var autoprefixer = require('autoprefixer')

function ensureSlash(path, needsSlash) {
  var hasSlash = path.endsWith('/')
  if (hasSlash && !needsSlash) {
    return path.substr(path, path.length - 1)
  } else if (!hasSlash && needsSlash) {
    return path + '/'
  } else {
    return path
  }
}
var homepagePath = require(paths.appPackageJson).homepage
var homepagePathname = homepagePath ? url.parse(homepagePath).pathname : '/'
var publicPath = ensureSlash(homepagePathname, true)
var publicUrl = ensureSlash(homepagePathname, false)

var env = getClientEnvironment(publicUrl)
if (env['process.env'].NODE_ENV !== '"production"') {
  throw new Error('Production builds must have NODE_ENV=production.')
}

module.exports = {
  context,
  bail: true,
  devtool: 'source-map',
  entry: [
    require.resolve('./polyfills'),
    paths.appIndexJs
  ],
  watch: true,
  output: {
    path: paths.appBuild,
    filename: 'main5.js',
    chunkFilename: '[name].[chunkhash:8].chunk.js',
    publicPath: publicPath
  },
  resolve: {
    modules: [path.resolve('./src'), path.resolve('./public'), 'node_modules'], 
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
          name: '[name].[hash:8].[ext]'
        }
      },
      {
        test: /\.(js|jsx)$/,
        include: paths.appSrc,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        include: paths.appSrc,
        exclude: path.resolve('./src/components/Editor'),
        use: [
          {
            loader: 'style-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
              localIdentContext: path.resolve(__dirname, "src"),
              localIdentName: '[path]___[name]__[local]___[hash:base64:5]',
            }
          },
          {
            loader: require.resolve('postcss-loader'),
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
            loader: require.resolve('postcss-loader'),
            options: {
                // Necessary for external CSS imports to work
                // https://github.com/facebookincubator/create-react-app/issues/2677
                ident: 'postcss',
                plugins: () => [
                    require('postcss-flexbugs-fixes'),
                    autoprefixer({
                        browsers: [
                            '>1%',
                            'last 4 versions',
                            'Firefox ESR',
                            'not ie < 9', // React doesn't support IE8 anyway
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
          name: '[name].[hash:8].[ext]'
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
      template: paths.appHtml,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      }
    }),
    new webpack.DefinePlugin(env),
    new webpack.LoaderOptionsPlugin({
           minimize: true
         }),
    new UglifyJsPlugin({
      // sourceMap: true,
      uglifyOptions: {
        compress: {
          warnings: false
        },
        output: {
          comments: false,
        },
        ie8: true,
      }
    }),
    new ExtractTextPlugin({
      filename: 'static/css/[name].[contenthash:8].css', 
      allChunks: true }),
    new ManifestPlugin({
      fileName: 'asset-manifest.json'
    }),
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
