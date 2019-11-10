const gulp = require('gulp');
const webpack = require('webpack');
const sass = require('gulp-sass');
const webpackConfig = require('./webpack.config.js');
const browserSync = require('browser-sync').create();

var paths = {
  javascript: './src/js/**/*.js',
  css: './src/css/**/*.scss',
};

// Run webpack
gulp.task('webpack', function(done) {
    return new Promise((resolve, reject) => {
        webpack(webpackConfig, (err, stats) => {
            if (err) {
                return reject(err);
            }
            if (stats.hasErrors()) {
                return reject(new Error(stats.compilation.errors.join('\n')));
            }
            resolve();
        });
    });
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src("src/css/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("dist/css"));
});

// Build task
gulp.task('build', gulp.parallel("sass", "webpack"));

// Development task
gulp.task('develop', function(done) {
    browserSync.init({
        files: ["dist/css/*.css", "dist/js/*.js", "dist/index.html"],
        server: {
            baseDir: "dist",
            index: "index.html"
        }
    });
    gulp.watch([paths.javascript], gulp.series("webpack"));
    gulp.watch([paths.css], gulp.series("sass"));
    done();
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', gulp.series("build", "develop"));
