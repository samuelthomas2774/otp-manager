const gulp = require('gulp');
const pump = require('pump');
const babel = require('gulp-babel');
const webpackStream = require('webpack-stream');
const electronPackager = require('electron-packager');

gulp.task('build-app', function () {
    return pump([
        gulp.src('src/app/**/*.js'),
        // plumber(),
        babel(),
        gulp.dest('dist/app')
    ]);
});

gulp.task('watch-app', gulp.series('build-app', function () {
    return gulp.watch('src/app/**/*.js', gulp.series('build-app'));
}));

gulp.task('build-main-window', function () {
    return pump([
        gulp.src(['src/main-window/index.js', 'src/main-window/styles/index.scss']),
        webpackStream(require('./src/main-window/webpack.config')),
        gulp.dest('dist/main-window')
    ]);
});

gulp.task('watch-main-window', function () {
    return pump([
        gulp.src(['src/main-window/index.js', 'src/main-window/styles/index.scss']),
        webpackStream(Object.assign({watch: true}, require('./src/main-window/webpack.config'))),
        gulp.dest('dist/main-window')
    ]);
});

gulp.task('build-details-window', function () {
    return pump([
        gulp.src(['src/account-details-window/index.js', 'src/account-details-window/styles/index.scss']),
        webpackStream(require('./src/account-details-window/webpack.config')),
        gulp.dest('dist/account-details-window')
    ]);
});

gulp.task('watch-details-window', function () {
    return pump([
        gulp.src(['src/account-details-window/index.js', 'src/account-details-window/styles/index.scss']),
        webpackStream(Object.assign({watch: true}, require('./src/account-details-window/webpack.config'))),
        gulp.dest('dist/account-details-window')
    ]);
});

gulp.task('build', gulp.parallel('build-app', 'build-main-window', 'build-details-window'));
gulp.task('watch', gulp.parallel('watch-app', 'watch-main-window', 'watch-details-window'));

gulp.task('package', function () {
    return electronPackager({
        dir: path.join(__dirname, 'dist'),
        platform: 'all',
        ignore: /(src|\..*|gulpfile\.js|package-lock.json)/i
    });
});

gulp.task('release', gulp.series('build', 'package'));
