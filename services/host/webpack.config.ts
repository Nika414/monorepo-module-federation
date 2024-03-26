import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import ReactRefreshTypeScript from 'react-refresh-typescript';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import packageJson from './package.json';

export default (env: any) => {
  const SHOP_REMOTE_URL = env.SHOP_REMOTE_URL ?? 'http://localhost:3001';
  const ADMIN_REMOTE_URL = env.ADMIN_REMOTE_URL ?? 'http://localhost:3002';

  return {
    mode: env.mode ?? 'development',
    entry: path.resolve(__dirname, 'src', 'index.tsx'),
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: '[name].[contenthash].js',
      clean: true,
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'public', 'index.html'),
        favicon: path.resolve(__dirname, 'public', 'trust-pilot.svg'),
        publicPath: '/'
      }),
      new webpack.container.ModuleFederationPlugin({
        name: 'host',
        filename: 'remoteEntry.js',

        remotes: {
          shop: `shop@${SHOP_REMOTE_URL}/remoteEntry.js`,
          admin: `admin@${ADMIN_REMOTE_URL}/remoteEntry.js`,
        },
        shared: {
          ...packageJson.dependencies,
          react: {
            eager: true,
            // requiredVersion: packageJson.dependencies['react'],
          },
          'react-router-dom': {
            eager: true,
            // requiredVersion: packageJson.dependencies['react-router-dom'],
          },
          'react-dom': {
            eager: true,
            // requiredVersion: packageJson.dependencies['react-dom'],
          },
        },
      }),
      // new ForkTsCheckerWebpackPlugin(),
      env.mode === 'development' && new webpack.ProgressPlugin(),
      env.mode === 'development' && new ReactRefreshWebpackPlugin(),
      env.mode === 'development' &&
        new MiniCssExtractPlugin({
          filename: 'css/[name].[contenthash:8].css',
          chunkFilename: 'css/[name].[contenthash:8].css',
        }),
      env.mode === 'production' && env.analyzer && new BundleAnalyzerPlugin(),
    ].filter(Boolean),

    module: {
      rules: [
        {
          test: /\.s[ac]ss$/i,
          use: [
            env.mode === 'development'
              ? MiniCssExtractPlugin.loader
              : 'style-loader',
            // Translates CSS into CommonJS
            {
              loader: 'css-loader',
              options: {
                modules: {
                  localIdentName: '[name]__[local]--[hash:base64:8]',
                },
              },
            },
            // Compiles Sass to CSS
            'sass-loader',
          ],
        },
        ,
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: require.resolve('ts-loader'),
              options: {
                getCustomTransformers: () => ({
                  before: [
                    env.mode === 'development' && ReactRefreshTypeScript(),
                  ].filter(Boolean),
                }),
                transpileOnly: true,
              },
            },
          ],
        },
        {
          test: /\.(png|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.svg$/,
          use: [
            {
              loader: '@svgr/webpack',
              options: {
                icon: true,
                svgoConfig: {
                  plugins: [
                    {
                      name: 'convertColors',
                      params: {
                        currentColor: true,
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
      ],
    },
    devtool: env.mode === 'development' && 'inline-source-map',
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    devServer:
      env.mode === 'development'
        ? { port: env.port ?? 3000, open: true, historyApiFallback: true }
        : undefined,
  };
};
