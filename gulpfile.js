/*eslint-env node */

const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const imagemin = require('gulp-imagemin');


gulp.task(
	'watch',
	['copy-html', 'copy-images', 'styles', 'scripts', 'imagemin'],
	function() {
		gulp.watch('src/sass/**/*.scss', ['styles']);
		gulp.watch('src/index.html', ['copy-html']);
    gulp.watch('src/img/**', ['imagemin'] );
		gulp.watch('./dist/index.html').on('change', browserSync.reload);

		browserSync.init({
			server: './dist'
		});
	}
);

gulp.task('dist', [
	'copy-html',
	'copy-images',
	'styles',
	'scripts-dist',
  'imagemin'
]);

gulp.task('scripts', function() {
	gulp
		.src('src/js/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel({
        presets: ['@babel/env']
    }))
		.pipe(concat('all.js'))
    .pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('dist/js'));
});

gulp.task('scripts-dist', () =>
    gulp
        .src('src/js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(concat('all.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/js'))
);

gulp.task('copy-html', function() {
	gulp.src('src/index.html').pipe(gulp.dest('./dist'));
});

gulp.task('copy-images', function() {
	gulp.src('src/img/*').pipe(gulp.dest('dist/img'));
});

gulp.task('styles', function() {
	gulp
		.src('src/sass/**/*.scss')
    .pipe(sourcemaps.init())
		.pipe(
			sass({
				outputStyle: 'compressed'
			}).on('error', sass.logError)
		)
		.pipe(
			autoprefixer({
				browsers: ['last 2 versions']
			})
		)
    .pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('dist/css'))
		.pipe(browserSync.stream());
});

gulp.task( 'imagemin', function() {
    gulp.src('src/img/**' )
    .pipe( imagemin() )
    .pipe( gulp.dest('dist/img') );
});
