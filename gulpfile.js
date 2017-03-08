const gulp = require('gulp');
const concat = require('gulp-concat');
const sass = require('gulp-sass');
const child = require('child_process');
const gutil = require('gulp-util');
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const svgstore = require('gulp-svgstore');
const svgmin = require('gulp-svgmin');
const path = require('path');
const cheerio = require('gulp-cheerio');

const cssFiles = '_css/**/*.?(s)css';
const siteRoot = '_site';

gulp.task('css', () => {
    gulp.src(cssFiles)
        .pipe(sass())
        .pipe(concat('style.css'))
        .pipe(autoprefixer())
        .pipe(cssnano())
        .pipe(gulp.dest('assets'))
});

gulp.task('jekyll', () => {
    const jekyll = child.spawn('jekyll', ['build',
        '--watch',
        '--incremental',
        '--drafts'
    ]);

    const jekyllLogger = (buffer) => {
        buffer.toString()
            .split(/\n/)
            .forEach((message) => gutil.log('Jekyll: ' + message));
    };

    jekyll.stdout.on('data', jekyllLogger);
    jekyll.stderr.on('data', jekyllLogger);
});

gulp.task('serve', () => {
    browserSync.init({
        files: [siteRoot + '/**'],
        port: 4000,
        server: {
            baseDir: siteRoot
        }
    });
    gulp.watch(cssFiles, ['css']);
});

gulp.task('svgstore', () => {
    return gulp
        .src('assets/svg_sprite/*.svg')
        .pipe(svgmin( (file) => {
            var prefix = path.basename(file.relative, path.extname(file.relative));
            return {
                plugins: [{
                    cleanupIDs: {
                        prefix: prefix + '-',
                        minify: true
                    }
                }]
            }
        }))
        .pipe(cheerio({
            run: function ($) {
                    $('style').remove();
                    $('[fill]').removeAttr('fill');
                    $('[class]').removeAttr('class');
                },
            parserOptions: { xmlMode: true }
        }))
        .pipe(svgstore())
        .pipe(gulp.dest('_includes/'));
});

gulp.task('default', ['css', 'jekyll', 'serve']);
