var gulp          = require('gulp'),
    browserSync   = require('browser-sync').create(),
    util          = require('gulp-util'),
    sass          = require('gulp-sass'),
    autoprefixer  = require('gulp-autoprefixer'),
    svgsprites    = require('gulp-svg-sprite'),
    sourcemaps    = require('gulp-sourcemaps'),
    concat        = require('gulp-concat'),
    order         = require('gulp-order')
    // stylelint     = require('gulp-stylelint');

var theme = './'
// for WP
// var theme = './wp-content/themes/teampapertheme'

var path = {
  src: {
    sass: theme + 'src/assets/sass',
    svg: theme + 'src/assets/img',
    img: theme + 'src/assets/img',
    js: theme + 'src/assets/js'
  },
  dest: {
    css: theme + 'public/assets/css',
    img: theme + 'public/assets/img',
    js: theme + 'public/assets/js'
  }
}

gulp.task('build:sass', async function () {
  gulp.src(path.src.sass + '/styles.scss')
  .pipe(sourcemaps.init())
  .pipe(sass().on('error', sass.logError))
  .pipe(autoprefixer({
    browsers: ['last 2 versions'],
    cascade: false
  }))
  .pipe(sourcemaps.write('./map'))
  .pipe(gulp.dest(path.dest.css))
  .pipe(browserSync.stream({match: '**/*.css'}))
})

// gulp.task('stylelint', async function () {
//   gulp.src([
//     path.src.sass + '/**/*.scss',
//     '!src/assets/sass/libs/**'
//    ])
//   .pipe(stylelint({
//      reporters: [
//        {formatter: 'string', console: true}
//      ]
//    }))
//   .pipe(stylelint().on('error', sass.logError))
// });

gulp.task('build:js', async function () {
  gulp.src(path.src.js + '/main.js')
  .pipe(gulp.dest(path.dest.js))
})

gulp.task('build:js:libs', async function () {
  gulp.src(path.src.js + '/libs/**/*.js')
  .pipe(order([
      'modernizr.js',
      //'svg-injector2.min.js',
		  //'svg-injector.js',
      'tingle.js',
      'offline.min.js',
      'cleave.min.js',
      'kawo-tooltip.js'
    ]))
  .pipe(concat('libs.js'))
  .pipe(gulp.dest(path.dest.js))
  .pipe(browserSync.stream({match: 'js/*.js'}))
})

gulp.task('build:symbol:svg', async function() {
  gulp.src(path.src.svg + '/svg-symbols/**/*.svg')
    .pipe(svgsprites({
      shape: {
        dimension: {
          precision: 2
          // attributes: true
        }
      },
      mode: {
        symbol: {
          bust: false,
          dest: '../',
          sprite: 'img/symbol-sprite.svg'
        }
      }
    }))
    .pipe(gulp.dest(path.dest.img))
})

gulp.task('build:sprite:svg', async function() {
  gulp.src(path.src.svg + '/svg-sprite/**/*.svg')
    .pipe(svgsprites({
      shape: {
        spacing: {
          padding: 4
        },
        dimension: {
          precision: 2
        }
      },
      mode: {
        css: {
          prefix: '.css-',
          dest: '.',
          sprite: './public/assets/img/svg-sprite.svg',
          dimensions: true,
          bust: false,
          render: {
            css: { dest: './public/assets/css/sprite.css' }
            // scss: { dest: './src/assets/sass/sprite.scss' }
          }
        },
      }
    }))
    .pipe(gulp.dest('./'));
});

gulp.task('build:img', async function() {
  gulp.src([path.src.img + '/svg/**/*.svg', path.src.img + '/**/*.png'])
    .pipe(gulp.dest(path.dest.img))
})

// gulp.task('build', [
//   'build:img',
//   'build:symbol:svg',
//   // 'build:sprite:svg',s
//   'build:sass',
//   'build:js',
//   'build:js:libs'
// ])

// gulp.task('server', ['build'], function() {
//   gulp.watch(path.src.sass + '/**/*.scss', ['build:sass'])
//   gulp.watch(path.src.js + '/**/*.js', ['build:js']).on('change', browserSync.reload)
//   gulp.watch('**/*.html').on('change', browserSync.reload)

//   // for layout
//   // browserSync.init({ server: "./" })

//   // Proxy
//   browserSync.init({
//     notify: false,
//     proxy: 'http://localhost:3000/'
//   })
// })

// gulp.task('sass:watch', ['build'], function() {
//   gulp.watch(path.src.sass + '/**/*.scss', ['build:sass'])
// })
