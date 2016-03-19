//
var gulp = require('gulp')
var util = require('gulp-util')
var less = require('gulp-less')
var browsersync = require('browser-sync').create()

gulp.task('default', ['build', 'watch'])
gulp.task('build', ['less'])

// Fix gulp's error handling
// See: https://github.com/gulpjs/gulp/issues/71
var origSrc = gulp.src
gulp.src = function () {
  return fixPipe(origSrc.apply(this, arguments))
}
function fixPipe (stream) {
  var origPipe = stream.pipe
  stream.pipe = function (dest) {
    arguments[0] = dest.on('error', function (error) {
      var nextStreams = dest._nextStreams
      if (nextStreams) {
        nextStreams.forEach(function (nextStream) {
          nextStream.emit('error', error)
        })
      } else if (dest.listeners('error').length === 1) {
        throw error
      }
    })
    var nextStream = fixPipe(origPipe.apply(this, arguments));
    (this._nextStreams || (this._nextStreams = [])).push(nextStream)
    return nextStream
  }
  return stream
}

// LESS
gulp.task('less', function () {
  return gulp.src('./less/example.less')
    .pipe(less().on('error', util.log))
    .pipe(gulp.dest('./css'))
    .pipe(browsersync.stream())
})

// Watch file changes
gulp.task('watch', ['browserSync'], function () {
  gulp.watch('./less/*.less', ['less', browsersync.stream])
})

// Server
gulp.task('browserSync', function () {
  browsersync.init({
    server: {
      baseDir: './'
    }
  })
})
