const gulp = require('gulp');
const rollup = require('rollup');
const resolve = require('rollup-plugin-node-resolve');
const rollupTypescriptPlugin = require('rollup-plugin-typescript2');
const tsc = require('gulp-typescript');
const tslint = require('gulp-tslint');
const merge = require('merge2');
const naturalSort = require('gulp-natural-sort');
const sourcemaps = require('gulp-sourcemaps');
const path = require('path');

function compile(tsConfig, dest) {
    let tsProject = tsc.createProject(tsConfig);

    let tsResult = tsProject.src() // instead of gulp.src(...)
        .pipe(naturalSort())
        .pipe(sourcemaps.init())
        .pipe(tsProject());

    return tsResult.js
        .pipe(sourcemaps.write('.')) // Now the sourcemaps are added to the .js file
        .pipe(gulp.dest(dest));
}

async function bundle(tsConfig, entry, dest) {
    const rollupBundle = await rollup.rollup({
        entry: entry,
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
                tsconfig: tsConfig
            })
        ]
    });

    await rollupBundle.write({
        format: 'iife',
        moduleName: 'home',
        dest: dest,
        sourceMap: true,
        globals: {
            jquery: 'jQuery',
            knockout: 'ko'
          }
    });
}

// gulp.task('compile-home', async function () {
//     const homeBundle = await rollup.rollup({
//         entry: './client/src/Home/Home.ts',
//         external: [
//             'jquery',
//             'knockout'
//         ],
//         globals: {
//             jquery: 'jQuery',
//             knockout: 'ko'
//           },
//         plugins: [
//             resolve(),
//             rollupTypescriptPlugin({
//                 tsconfig: 'client/src/tsconfig.json'
//             })
//         ]
//     });

//     await homeBundle.write({
//         format: 'iife',
//         moduleName: 'home',
//         dest: './client/dist/home.js',
//         sourceMap: true,
//         globals: {
//             jquery: 'jQuery',
//             knockout: 'ko'
//           }
//     });
// });

gulp.task('build-common', function () {
    return compile('./client/src/Common/tsconfig.json', './dist/public/js');
});

gulp.task('build-home', async function () {
    return bundle('client/src/tsconfig.json', './client/src/Home/Home.ts', 'dist/public/js/home.js');
});

gulp.task('build-vote', async function () {
    return bundle('client/src/tsconfig.json', './client/src/VoteResults/Vote.ts', 'dist/public/js/vote.js');
});

gulp.task('build-client', ['build-common', 'build-home', 'build-vote']);

gulp.task('build-server', function() {
    return compile('./server/src/tsconfig.json', './dist');
});