const gulp = require('gulp');
const rollup = require('rollup');
const resolve = require('rollup-plugin-node-resolve');
const rollupTypescript = require('rollup-plugin-typescript2');

gulp.task('bundle-home', async function () {
    const homeBundle = await rollup.rollup({
        entry: './client/src/Home/Home.ts',
        external: [
            'jquery',
            'knockout'
        ],
        globals: {
            jquery: 'jQuery',
            knockout: 'ko'
          },
        plugins: [
            resolve(),
            rollupTypescript()
        ]
    });

    await homeBundle.write({
        format: 'iife',
        moduleName: 'home',
        dest: './client/dist/home.js',
        sourceMap: true,
        globals: {
            jquery: 'jQuery',
            knockout: 'ko'
          }
    });
});

gulp.task('build', ['bundle-home'], function() {
});