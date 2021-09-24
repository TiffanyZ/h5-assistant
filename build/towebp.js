/**
 *
 * @authors liwb (you@example.org)
 * @date    2019-03-12 10:47
 * @description 转换 webp 格式文件
 */

'use strict';

const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');
const fs = require('fs');
const chalk = require('chalk');

const fileSrc = './src/assets/img/*.{jpeg,jpg,png,JPEG,JPG,PNG}';
const fileOut = 'src/assets/img/';

(async () => {
  const files = await imagemin([fileSrc], {
    destination: fileOut,
    plugins: [imageminWebp({ autoFilter: true })],
  });

  // console.log(files);
  //=> [{data: <Buffer 89 50 4e …>, destinationPath: 'build/images/foo.webp'}, sourcePath: 'src/assets/img/foo.jpg' …]
  let outputName = '';
  if (Array.isArray(files) && files.length) {
    files.forEach((file) => {
      const { destinationPath, sourcePath } = file;
      const fileExtension = sourcePath
        .split('.')
        .pop()
        .toLowerCase();
      outputName = `${outputName}.${fileExtension}.webp`;
      fs.rename(destinationPath, outputName, function() {});
    });
  }

  console.log(chalk.green(`webp转换已完成～`));
})();
