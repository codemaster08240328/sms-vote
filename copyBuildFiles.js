const shell = require('shelljs');

shell.mkdir('dist');
shell.cp('-R', 'server/dist/*', 'dist');
shell.cp('-R', 'server/.env', 'dist/');
shell.cp('-R', 'server/views', 'dist');
shell.cp('-R', 'server/public', 'dist');
//shell.cp('-R', 'client/dist/*', 'dist/public/js');