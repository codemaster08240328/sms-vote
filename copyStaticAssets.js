const shell = require('shelljs');
// const clientAssets = require('../client/build/asset-manifest.json');
// const replace = require('replace-in-file');

shell.cp('-R', 'public/js/lib', 'dist/public/js/');
shell.cp('-R', 'public/fonts', 'dist/public/');
shell.cp('-R', 'public/images', 'dist/public/');
// shell.cp('-R', '../client/build/static/*', 'dist/public/');

// var css = clientAssets['main.css'].replace('static/css/', '');
// var js = clientAssets['main.js'].replace('static/js/', '');

// replace.sync({
//     files: 'views/layout.pug',
//     from: [/main.[a-z0-9]+.css/, /main.[a-z0-9]+.js/],
//     to: [css, js]
//   });

shell.cp('-R', 'client/dist/*', 'dist/public/js')