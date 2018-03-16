'use strict';

const fs = require('fs'),
    path = require('path'),
    glob = require('glob');

const Ractive = require('ractive');

const TPL_DIR = __dirname + '/../src/templates';

new Promise((resolve, reject) => {

    glob(TPL_DIR + '/**/*.html', (err, files) => {

        if (err) throw err;

        let count = files.length;

        if (count === 0) {
            return reject('Templates not found.');
        }

        console.log('Files: ', files);

        const options = {
            sanitize: true
        };

        files.forEach((file, i) => {

            fs.readFile(file, 'utf8', (err, template) => {

                if (err) throw err;

                console.log('Template ', i, template);

                const parsed = `module.exports = ${JSON.stringify(Ractive.parse(template, options))}`,
                    fileInfo = path.parse(file);

                console.log('Parsed ', i, parsed);

                fs.writeFile(TPL_DIR + `/parsed/${fileInfo.name}.js`, parsed, 'utf8', (err) => {
                    if (err) throw err;
                });
            });

            if (--count == 0) {
                return resolve('Templates parsing completed.');
            }

        });

    });

}).then(console.log).catch(console.log);