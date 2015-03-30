var gulp = require('gulp');
var webserver = require('gulp-webserver');

gulp.task('webserver', function() {
    gulp.src('./')
        .pipe(webserver({
            port: 1234,
            livereload: false,
            directoryListing: true,
            open: true,
            fallback: 'index.html'
        }));
});