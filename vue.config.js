'use strict';

const path = require('path');
const { formatDate } = require('@liwb/cloud-utils');
const pkg = require('./package');
const webpack = require('webpack');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const chalk = require('chalk');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const Carefree = require('@liwb/carefree-webpack-plugin');
const {
  host,
  port,
  source,
  username,
  password,
  target,
} = require('./carefree');
const VueRouterInvokeWebpackPlugin = require('@liwb/vue-router-invoke-webpack-plugin');
const SizePlugin = require('size-plugin');
// const TerserPlugin = require('terser-webpack-plugin');
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin');

const resolve = (dir) => {
  return path.join(__dirname, './', dir);
};

const isProd = () => {
  return process.env.NODE_ENV === 'production';
};

const isCarefree = () => {
  return process.env.NODE_ENV === 'carefree';
};

function addStyleResource(rule) {
  rule
    .use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [
        path.resolve(__dirname, 'src/assets/less/variable.less'),
        path.resolve(__dirname, 'node_modules/magicless/magicless.less'),
      ],
      injector: 'prepend',
    });
}

// cdn
const cdn = {
  // 开发环境
  dev: {
    css: [],
    js: [],
  },
  // 生产环境
  build: {
    css: [],
    js: [
      'https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.10/vue.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/vue-router/3.0.6/vue-router.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/axios/0.19.0/axios.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/vuex/3.1.1/vuex.min.js',
    ],
  },
};

const externals = {
  vue: 'Vue',
  'vue-router': 'VueRouter',
  axios: 'axios',
};

const genPlugins = () => {
  const plugins = [
    new ProgressBarPlugin({
      format:
        '  build [:bar] ' +
        chalk.green.bold(':percent') +
        ' (:elapsed seconds)',
      clear: false,
    }),
    new VueRouterInvokeWebpackPlugin({
      dir: 'src/views',
      // must set the alias for the dir option which you have set
      alias: '@/views',
      mode: 'hash',
      routerDir: 'src/router',
      ignore: ['images', 'components'],
      redirect: [
        {
          redirect: '/home',
          path: '/',
        },
      ],
    }),
    // 为静态资源文件添加 hash，防止缓存
    new AddAssetHtmlPlugin([
      {
        filepath: path.resolve(__dirname, './public/config.local.js'),
        hash: true,
      },
      {
        filepath: path.resolve(__dirname, './public/console.js'),
        hash: true,
      },
    ]),
    // bannerPlugin
    new webpack.BannerPlugin({
      banner: `Current version ${pkg.version} and build time ${formatDate(
        new Date(),
        'yyyy-MM-dd HH:mm:ss'
      )}`,
    }),
    new DuplicatePackageCheckerPlugin(),
  ];

  if (isProd()) {
    plugins.push(
      new CompressionWebpackPlugin({
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        test: new RegExp('\\.(' + ['js', 'css'].join('|') + ')$'),
        threshold: 10240,
        minRatio: 0.8,
        cache: true,
      }),
      // 在每次执行打包命令后打印出本次构建的资源体积并和上次构建结果进行对比
      new SizePlugin()
    );
  }

  if (isCarefree()) {
    plugins.push(
      new Carefree({
        qrcodeUrl: `http://www.example.com/${pkg.name}/index.html`,
        devtool: 'true',
        ssh: {
          host,
          port,
          source,
          username,
          password,
          target: `${target}${pkg.name}`,
        },
      })
    );
  }

  return plugins;
};

// const getOptimization = () => {
//   let optimization = {};
//   if (isProd()) {
//     optimization = {
//       // https://webpack.docschina.org/configuration/optimization/#optimization-minimizer
//       minimizer: [
//         new TerserPlugin({
//           terserOptions: {
//             // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
//             compress: {
//               warnings: false,
//               drop_console: true,
//               drop_debugger: true,
//               pure_funcs: ['console.log'],
//             },
//           },
//         }),
//       ],
//     };
//   }
//   return optimization;
// };

module.exports = {
  /**
   * You can set by yourself according to actual condition
   * You will need to set this if you plan to deploy your site under a sub path,
   * for example GitHub pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then assetsPublicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail https://cli.vuejs.org/config/#publicPath
   */
  publicPath: './',

  assetsDir: isCarefree() ? './' : 'static',
  lintOnSave: process.env.NODE_ENV !== 'production',
  productionSourceMap: false,

  // webpack-dev-server 相关配置
  devServer: {
    open: process.platform === 'darwin',
    host: '0.0.0.0',
    port: 3000,
    https: false,
    hotOnly: false,
    overlay: {
      warnings: false,
      errors: true,
    },
  },

  // css相关配置
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: isProd() ? true : false,
    // 开启 CSS source maps?
    sourceMap: isProd() ? true : false,
    // css预设器配置项
    loaderOptions: {},
  },

  configureWebpack: () => ({
    name: `${pkg.name}`,
    resolve: {
      alias: {
        '@': resolve('src'),
        '@assets': resolve('src/assets'),
        '@less': resolve('src/assets/less'),
        '@js': resolve('src/assets/js'),
        '@components': resolve('src/components'),
        '@mixins': resolve('src/mixins'),
        '@filters': resolve('src/filters'),
        '@store': resolve('src/store'),
        '@views': resolve('src/views'),

        // 文件别名
        services: resolve('src/services'),
        variable: resolve('src/assets/less/variable.less'),
        utils: resolve('node_modules/@liwb/cloud-utils/dist/cloud-utils.esm'),
        mixins: resolve('node_modules/magicless/magicless.less'),
      },
    },
    plugins: genPlugins(),
    externals: isProd() ? externals : {},
    // 生产环境去掉 console.log
    // https://github.com/cklwblove/vue-cli3-template/issues/12
    // optimization: getOptimization()
  }),

  // webpack配置
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  chainWebpack: (config) => {
    config.plugins.delete('preload'); // TODO: need test
    config.plugins.delete('prefetch'); // TODO: need test
    // module

    // style-resources-loader
    const types = ['vue-modules', 'vue', 'normal-modules', 'normal'];
    types.forEach((type) =>
      addStyleResource(config.module.rule('less').oneOf(type))
    );

    // svg
    // exclude icons
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end();

    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('url-loader')
      .loader('url-loader')
      .end();

    config.when(process.env.NODE_ENV === 'development', (config) =>
      config.devtool('cheap-eval-source-map')
    );

    // webpack-html-plugin
    config.plugin('html').tap((args) => {
      args[0].minify = {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      };
      // 添加CDN参数到htmlWebpackPlugin配置中
      if (process.env.NODE_ENV === 'production') {
        args[0].cdn = cdn.build;
      }

      return args;
    });

    // set preserveWhitespace
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap((options) => {
        options.compilerOptions.preserveWhitespace = true;
        return options;
      })
      .end();

    // optimization
    // https://imweb.io/topic/5b66dd601402769b60847149
    config.when(process.env.NODE_ENV === 'production', (config) => {
      // vue-cli4
      // https://cli.vuejs.org/migrating-from-v3/#vue-cli-service
      // config.optimization.minimizer('terser').tap((args) => {
      //   args[0].terserOptions.compress.drop_console = true;
      //   return args;
      // });
      config
        .plugin('ScriptExtHtmlWebpackPlugin')
        .after('html')
        .use('script-ext-html-webpack-plugin', [
          {
            // `runtime` must same as runtimeChunk name. default is `runtime`
            inline: /runtime\..*\.js$/,
          },
        ])
        .end();

      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          vendors: {
            name: 'chunk-vendors',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial', // 只打包初始时依赖的第三方
          },
          commons: {
            name: 'chunk-commons',
            test: resolve('src/components'), // 可自定义拓展你的规则
            minChunks: 3, // 最小公用次数
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      });
      config.optimization.runtimeChunk('single');
    });
  },

  pluginOptions: {
    lintStyleOnBuild: true,
    stylelint: {},
    electronBuilder: {
      builderOptions: {
        appId: "com.test.app",
        productName: "Lang", //项目名，也是生成的安装文件名，即aDemo.exe
        copyright: "Copyright © 2021", //版权信息
        directories: {
          output: "./dist" //输出文件路径
        },
        win: {
          //win相关配置
          icon: "./build/icons/icon.ico", //图标，当前图标在根目录下，注意这里有两个坑
          target: [
            {
              target: "nsis", //利用nsis制作安装程序,打包文件的后缀为exe
              arch: [
                "x64", //64位
                "ia32" //32位
              ]
            }
          ]
        },
        nsis: {
          oneClick: false, //一键安装
          language: "2052", //安装语言
          perMachine: true, //应用所有用户
          allowToChangeInstallationDirectory: true //用户可以选择路径
        }
      }
    }
  },
};
