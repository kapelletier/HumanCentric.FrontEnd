// Node modules
var fs = require('fs'), vm = require('vm'), merge = require('deeply'), chalk = require('chalk'), es = require('event-stream'), path = require('path'), url = require('url'), slash = require('slash');

// Gulp and plugins
//
var gulp = require('gulp'), rjs = require('gulp-requirejs-bundler'), concat = require('gulp-concat'), clean = require('gulp-clean'), filter = require('gulp-filter'),
    replace = require('gulp-replace'), uglify = require('gulp-uglify'), htmlreplace = require('gulp-html-replace'),
    connect = require('gulp-connect'),  objectAssign = require('object-assign');

// Config
var requireJsRuntimeConfig = vm.runInNewContext(fs.readFileSync('src/app/require.config.js') + '; require;'),
    requireJsOptimizerConfig = merge(requireJsRuntimeConfig, {
        out: 'scripts.js',
        baseUrl: './src',
        name: 'app/startup',
        paths: {
            requireLib: 'bower_modules/requirejs/require'
        },
        include: [
            'requireLib',
            'components/nav-bar/nav-bar',
            'components/home-page/home', //'text!components/about-page/about.html'
            'components/conditions-page/conditions',
            'components/constituents-page/constituents',
            'components/offerings-page/offerings'
        ],
        insertRequire: ['app/startup'],
        bundles: {
            // If you want parts of the site to load on demand, remove them from the 'include' list
            // above, and group them into bundles here.
            // 'bundle-name': [ 'some/module', 'another/module' ],
            // 'another-bundle-name': [ 'yet-another-module' ]
        }
    });
    
// Discovers all AMD dependencies, concatenates together all required .js files, minifies them
// ['js:babel']
gulp.task('js:optimize', function() {
    var config = objectAssign({}, requireJsOptimizerConfig, { baseUrl: 'src' });
    return rjs(config)
        .pipe(uglify({ preserveComments: 'some' }))
        .pipe(gulp.dest('./build/'));    
})

// Builds the distributable .js files by calling Babel then the r.js optimizer
//
gulp.task('js', ['js:optimize'], function () {
    // Now clean up
    //return gulp.src('./temp', { read: false }).pipe(clean());
});

// Concatenates CSS files, rewrites relative paths to Bootstrap fonts, copies Bootstrap fonts
gulp.task('css', function () {
    var bowerCss = gulp.src('src/bower_modules/bootstrap/dist/css/bootstrap.min.css')
            .pipe(replace(/url\((')?\.\.\/fonts\//g, 'url($1fonts/')),
        appCss = gulp.src('src/css/*.css'),
        combinedCss = es.concat(bowerCss, appCss).pipe(concat('css.css')),
        fontFiles = gulp.src('./src/bower_modules/bootstrap/fonts/*', { base: './src/bower_modules/bootstrap/' });
    return es.concat(combinedCss, fontFiles)
        .pipe(gulp.dest('./build/'));
});

// Copies index.html, replacing <script> and <link> tags to reference production URLs
gulp.task('html', function() {
    return gulp.src('./src/index.html')
        .pipe(htmlreplace({
            'css': 'css.css',
            'js': 'scripts.js'
        }))
        .pipe(gulp.dest('./build/'));
});

// Removes all files from ./dist/
gulp.task('clean', function() {
    return gulp.src('./build/**/*', { read: false })
        .pipe(clean());
});

// After building, starts a trivial static file server
gulp.task('serve:dist', ['default'], function() {
    return connect.server({ root: './build' });
});

gulp.task('default', ['html', 'js', 'css'], function(callback) {
    callback();
    console.log('\nPlaced optimized files in ' + chalk.magenta('build/\n'));
});
