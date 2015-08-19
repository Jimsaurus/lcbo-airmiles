var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();

//setup gulp task....can be named anything...we named it styles
gulp.task('styles', function(){
	//return our transformed file
	//we use the gulp.src method to tell gulp what files to look at!
	// we pass in a string that is a path relative to our gulp.js
	return gulp.src('css/*.scss')
			//.pipe pushes data along...into sass()..sass converts scss to css
			//on error log the error nicely
			.pipe( sass().on('error', sass.logError) )
			// concat() takes css data and creates a file to hold data
			.pipe(concat('styles.css'))
			//autoprefixer
			.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
			// gulp.dest() tells concat where to put finished css file!
			.pipe(gulp.dest('css/'))
			.pipe(browserSync.stream());
});

gulp.task('jshint', function(){
	return gulp.src('js/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'));
});
gulp.task('browser-sync', function() {
    browserSync.init({
        proxy: "localhost:8888/bootcamp-projects/week-6-project/lcbo-airmiles"
    });
});
gulp.task('watch', function(){
	gulp.watch('css/*.scss', ['styles']);
	gulp.watch('js/*.js', ['jshint']);
});

gulp.task('default', ['browser-sync', 'styles', 'jshint', 'watch']);