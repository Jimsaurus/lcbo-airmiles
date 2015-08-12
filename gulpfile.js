var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');

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
			// gulp.dest() tells concat where to put finished css file!
			.pipe(gulp.dest('css/'));
});

gulp.task('jshint', function(){
	return gulp.src('js/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));

});
gulp.task('watch', function(){
	gulp.watch('css/*.scss', ['styles']);
	gulp.watch('js/*.js', ['jshint']);
});

gulp.task('default', ['watch']);