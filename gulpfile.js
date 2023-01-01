'use strict';
const fs = require('fs-extra');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const browserify = require('browserify');
const tsify = require('tsify');
const gulp = require('gulp');
const header = require('gulp-header');
const debug = require('gulp-debug');
const terser = require('gulp-terser');
const eslint = require('gulp-eslint');
const stylelint = require('./node_modules/@ronilaukkarinen/gulp-stylelint');
const replace = require('gulp-replace');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat-css');
const filter = require('gulp-filter');
const del = require('del');

/* CONFIG */
const pjson = require('./package.json');
const SCRIPT_NAME = 'TrueAchievements Extra';
const OUT_FILE_NAME = pjson.name;
const DEST_PATH = './dist/';
const DEST_TAMPERDAV_PATH = `${DEST_PATH}Tampermonkey/sync/`;
const DEST_STYLES_PATH = `${DEST_PATH}styles/`;
const TS_PATH = './src/**/*.ts';
const SCSS_PATH = './src/**/*.s+(a|c)ss';
const VIEW_PATH = './src/**/*.html';
const HEADER_PATH = './src/header.ts';
const TS_ENTRY = './src/index.ts';

/* CACHE */
let cachedMeta;

/* Tasks */
gulp.task('lint:html', () => gulp.src(VIEW_PATH, { base: './src/views/' })
    .pipe(stylelint({
      failAfterError: true,
      reporters: [
        { formatter: 'string', console: true }
      ]
    })));

gulp.task('lint:styles', () => gulp.src(SCSS_PATH, { base: './src/styles/' })
    .pipe(stylelint({
      failAfterError: true,
      reporters: [
        { formatter: 'string', console: true }
      ]
    })));

gulp.task('lint:ts', () => gulp.src([TS_PATH, `!${DEST_PATH}/**`, '!node_modules/**'], { base: './src/' })
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError()));

gulp.task('build:styles', () => {
  const bundlePathFilter = filter(['./dist/styles/**/*.css']);

  return gulp.src(SCSS_PATH, { base: './src/styles/' })
    .pipe(debug({ title: 'Linting:', showCount: false }))
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(DEST_STYLES_PATH), { overwrite: true })
    .pipe(bundlePathFilter)
    .pipe(concat(`./${OUT_FILE_NAME}.styles.css`))
    .pipe(gulp.dest(DEST_STYLES_PATH, { overwrite: true }))
    .on('end', () => del.sync([`${DEST_STYLES_PATH}**/*`, `!${DEST_STYLES_PATH}${OUT_FILE_NAME}.styles.css`]));
});

gulp.task('build:dev', () => new Promise(resolve => {
  const b = browserify()
    .add(TS_ENTRY)
    .plugin(tsify);

  return resolve(b.bundle()
      .pipe(source(`${OUT_FILE_NAME}.user.js`))
      .pipe(buffer())
      .pipe(header(fs.readFileSync(HEADER_PATH, 'utf8') + '\n')) // Add header to UserScript.
      .pipe(replace(/@name\W\s*([\w\d\s]*)/g, match => match.replace(SCRIPT_NAME, `${SCRIPT_NAME} - Development`)))
      .pipe(replace(/@description\W\s*([\w\d\s:\/{}.-]*)/g, match => match.replace('{from-package.json}', pjson.description)))
      .pipe(replace(/@version\W\s*([\w\d\s:\/{}.-]*)/g, match => match.replace('{from-package.json}', `${pjson.version}.${new Date().toLocaleString().replace(', ', '-').replace(/:/g, '').replace(/\//g, '').split(' ')[0]}`)))
      .pipe(replace(/@author\W\s*([\w\d\s:\/{}.-]*)/g, match => match.replace('{from-package.json}', pjson.author)))
      .pipe(replace(/@updateURL\W\s*([\w\d\s:\/.-]*)/g, match => match.replace('.min.user.js', `.user.js`)))
      .pipe(replace(/@downloadURL\W\s*([\w\d\s:\/.-]*)/g, match => match.replace('.min.user.js', `.user.js`)))
      .pipe(replace(/Last Updated:\W\s*([\w\d\s:\/{}.-]*)/g, match => match.replace('{date-time-now}', new Date().toLocaleString())))
      .pipe(gulp.dest(DEST_PATH))
      .on('finish', () => {
        if (!fs.existsSync(DEST_TAMPERDAV_PATH)) {
          console.debug(`Tampermonkey sync folder created: ${DEST_TAMPERDAV_PATH}`);
          fs.mkdirsSync(DEST_TAMPERDAV_PATH);
          return;
        }
      }));
}));

gulp.task('build:prod', () => new Promise(resolve => {
  const b = browserify()
    .add(TS_ENTRY)
    .plugin(tsify);

  return resolve(b.bundle()
      .pipe(source(OUT_FILE_NAME + '.min.user.js'))
      .pipe(buffer())
      .pipe(terser()) // uglify only in production.
      .pipe(header(fs.readFileSync(HEADER_PATH, 'utf8') + '\n')) // Add header to UserScript.
      .pipe(replace(/@description\W\s*([\w\d\s:\/{}.-]*)/g, match => match.replace('{from-package.json}', pjson.description)))
      .pipe(replace(/@version\W\s*([\w\d\s:\/{}.-]*)/g, match => match.replace('{from-package.json}', pjson.version)))
      .pipe(replace(/^.*{from-browser-sync}.*$\r?\n/mg, match => match.replace(/(.*|\r\n|\n|\r)/, '').trim()))
      .pipe(replace(/@author\W\s*([\w\d\s:\/{}.-]*)/g, match => match.replace('{from-package.json}', pjson.author)))
      .pipe(replace(/Last Updated:\W\s*([\w\d\s:\/{}.-]*)/g, match => match.replace('{date-time-now}', new Date().toLocaleString())))
      .pipe(gulp.dest(DEST_PATH)));
}));

gulp.task('sync-tampermonkey', done => {
  if (!cachedMeta) {
    console.debug(`Attempting to locate meta.json for ${SCRIPT_NAME} - Development`);

    const files = fs.readdirSync(DEST_TAMPERDAV_PATH).filter(file => {
      if (!file.endsWith('.meta.json')) return false;
      try {
        if (!fs.existsSync(`${DEST_TAMPERDAV_PATH}${file}`)) return false;
        return fs.readJsonSync(`${DEST_TAMPERDAV_PATH}${file}`).name === `${SCRIPT_NAME} - Development`;
      } catch (ex) {
        fs.unlinkSync(`${DEST_TAMPERDAV_PATH}${file}`);
        fs.unlinkSync(`${DEST_TAMPERDAV_PATH}${file}`.replace('.meta.json', '.user.js'));
        return false;
      }
    });

    if (!files.length || files.length !== 1) {
      console.debug(`Failed to locate meta.json for ${SCRIPT_NAME} - Development, Unable to trigger a sync`);
    } else {
      const metaFilePath = `${DEST_TAMPERDAV_PATH}${files[0]}`;
      cachedMeta = fs.readJsonSync(metaFilePath);
  
      console.debug(`Located and cached meta.json for ${SCRIPT_NAME} - Development: ${metaFilePath}`);
    }
  } else {
    console.debug(`Previously located meta.json for ${SCRIPT_NAME} - Development using cached data`);
  }

  if (cachedMeta) {
    cachedMeta.lastModified = Date.now();
    fs.copySync(`${DEST_PATH}${OUT_FILE_NAME}.user.js`, `${DEST_TAMPERDAV_PATH}${cachedMeta.uuid}.user.js`, { overwrite: true });
    fs.writeJsonSync(`${DEST_TAMPERDAV_PATH}${cachedMeta.uuid}.meta.json`, cachedMeta);

    setTimeout(() => {
      console.debug(`Succesfully replaced and (hopefully) triggered a sync for ${SCRIPT_NAME} - Development`);
      done();
    }, 3000);
  }
});

gulp.task('watch', () => {
  gulp.watch(TS_PATH.substring(2), { cwd: './' }, gulp.series([gulp.parallel(['build:dev', 'build:prod'])]));
  gulp.watch(SCSS_PATH.substring(2), { cwd: './' }, gulp.series(['build:styles', gulp.parallel(['build:dev', 'build:prod'])]));
  gulp.watch(VIEW_PATH.substring(2), { cwd: './' }, gulp.series([gulp.parallel(['build:dev', 'build:prod'])]));
  gulp.watch(`${DEST_PATH}${OUT_FILE_NAME}.user.js`, gulp.series(['sync-tampermonkey']));
});

gulp.task('default', gulp.series([gulp.parallel(['lint:html', 'lint:styles', 'lint:ts']), 'build:styles', gulp.parallel(['build:dev', 'build:prod'])]));
