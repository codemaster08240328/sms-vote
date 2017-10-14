const gulp = require('gulp');
const rollup = require('rollup');
const resolve = require('rollup-plugin-node-resolve');
const rollupTypescriptPlugin = require('rollup-plugin-typescript2');
const tsc = require('gulp-typescript');
const tslint = require('gulp-tslint');
const merge = require('merge2');
const naturalSort = require('gulp-natural-sort');

gulp.task('compile-common', function () {
    var tsProject = tsc.createProject('./client/src/Common/tsconfig.json');

    var tsResult = tsProject.src() // instead of gulp.src(...)
        .pipe(naturalSort())
        .pipe(tsProject());

    return merge([tsResult.js.pipe(gulp.dest('.'))]);
});


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
            rollupTypescriptPlugin({
                tsconfig: "client/tsconfig.json"
            })
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

gulp.task('compile', ['compile-common', 'bundle-home']);

gulp.task('build', ['compile'], function() {
    gulp.src('./client/dist/*')
        .pipe(gulp.dest('./dist/public/js/'))
});