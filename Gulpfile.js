var gulp = require('gulp'),
    del = require('del'),
    runSequence = require('run-sequence'),
    ngHtml2Js = require("gulp-ng-html2js"),
    plumber = require('gulp-plumber'),
    jade = require('gulp-jade'),
    browserify = require('browserify'),
    sourcemaps = require('gulp-sourcemaps'),
    source = require('vinyl-source-stream'),
    ngAnnotate = require('gulp-ng-annotate'),
    jshint = require('gulp-jshint'),
    jsHintStylish = require('jshint-stylish'),
    buffer = require('vinyl-buffer'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    stylus = require('gulp-stylus'),
    spritesmith = require('gulp.spritesmith'),
    mainBowerFiles = require('main-bower-files'),
    babelify = require('babelify');

var NG_MODULE_NAME = 'SFA';
var PATHS = {
    DEST: 'public',
    JS: {
        MAIN: 'src/js/app/main.js',
        ALL: 'src/js/**/*.js'
    },
    JADE: 'src/templates/*.jade',
    STYLUS: {
        ALL: 'src/stylus/**/*.styl',
        MAIN: 'src/stylus/style.styl'
    },
    SPRITES: 'src/sprites/*.png'

};



// gulp.task('clean', function(cb) {
//     del([(PATHS.DEST + '/*')]).then(function() {
//         cb();
//     });
// });



gulp.task('watch', function() {
    gulp.watch(PATHS.JS.ALL, ['angular-js']);
    gulp.watch(PATHS.JADE, ['templates']);
    gulp.watch(PATHS.STYLUS.ALL, ['stylus']);
    gulp.watch(PATHS.SPRITES, ['sprites']);
});

gulp.task('templates', function() {
    return gulp.src(PATHS.JADE)
        .pipe(plumber())
        .pipe(jade())
        .pipe(ngHtml2Js({
            moduleName: NG_MODULE_NAME
        }))
        .pipe(concat('templates.js'))
        .pipe(gulp.dest(PATHS.DEST + '/js'))
});

//validate using jshint
gulp.task('jshint', function() {
    return gulp.src(PATHS.JS.ALL)
        .pipe(jshint({
            browser: true,
            devel: true,
            noempty: false,
            plusplus: false,
            esversion: 6,
            globals: ['$', 'jQuery', 'angular', 'require']
        }))
        .pipe(jshint.reporter(jsHintStylish));
});

gulp.task('angular-js', ['jshint'], function() {

    browserify({
            entries: PATHS.JS.MAIN
        })
        .transform(babelify, {presets: ["es2015", "stage-0"]})
        .bundle().on('error', function(err) {
            console.error(err.toString());
            this.emit("end");
        })
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(plumber())
        .pipe(ngAnnotate())
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest(PATHS.DEST + '/js'));
});

//contact bower javascript to a single file
gulp.task('bower', function() {
    return gulp.src(mainBowerFiles('**/*\.js'))
        .pipe(sourcemaps.init())
        .pipe(concat('vendor.js'))
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest(PATHS.DEST + '/js'));
});

//copy bower css & other files
gulp.task('bower-other', function() {
    return gulp.src(mainBowerFiles({
        filter: function(file) {
            return file.substring(file.length - 2) !== 'js';
        }
    }), {
        base: 'bower_components'
    }).pipe(gulp.dest(PATHS.DEST + '/bower_components/'))
});

gulp.task('stylus', function() {
    return gulp.src(PATHS.STYLUS.MAIN)
        .pipe(stylus())
        .pipe(gulp.dest(PATHS.DEST + '/css'));
});

gulp.task('sprites', function() {
    var spriteData = gulp.src(PATHS.SPRITES)
        .pipe(spritesmith({
            /* this whole image path is used in css background declarations */
            imgPath: '/images/sprite.png',
            imgName: 'sprite.png',
            cssName: 'sprite.css'
        }));
    spriteData.img.pipe(gulp.dest(PATHS.DEST + '/images'));
    spriteData.css.pipe(gulp.dest(PATHS.DEST + '/css'));
});

// gulp.task('uglify', function() {
//     return gulp.src(PATHS.DEST + '/js/**/*.js')
//         .pipe(uglify())
//         .pipe(gulp.dest(PATHS.DEST + '/js'));
// });

gulp.task('build', function(cb) {
    runSequence(['bower', 'bower-other', 'templates', 'angular-js', 'stylus', 'sprites'], cb);
});
gulp.task('develop', function(cb) {
    runSequence('build', ['watch'], cb);
});
gulp.task('prod', function(cb) {
    runSequence('build', cb);
});
