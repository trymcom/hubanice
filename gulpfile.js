var ROOT_DIR	=	"./";
var ASSETS_DIR	=	ROOT_DIR +"assets/";

var SCSS_SRC	=	ASSETS_DIR +'sass/**/*.scss';
var TPL_SRC		=	[
	ASSETS_DIR +"/ejs/**/*.ejs",
	"!"+ ASSETS_DIR +"/ejs/*_*/*.ejs",
];

var HTML_DEST 	=	ROOT_DIR;
var CSS_DEST	=	ASSETS_DIR +"/css/";

// gulpプラグインの読み込み
const gulp			=	require("gulp");
const sass			=	require("gulp-sass");
const sourcemaps	=	require("gulp-sourcemaps");
const autoprefixer	=	require('gulp-autoprefixer');

const rename		=	require('gulp-rename');
const ejs			=	require('gulp-ejs');

gulp.task("default", function () {
	gulp.watch(ASSETS_DIR +"sass/**/*.scss", gulp.series("scss"));
	gulp.watch(ASSETS_DIR +"ejs/**/*.ejs", gulp.series("ejs"));
});

gulp.task("ejs", function () {
	return gulp.src(TPL_SRC)
		.pipe(ejs())
		.pipe(rename({extname: '.html'}))
		.pipe(gulp.dest(HTML_DEST));
});

gulp.task("scss", function() {
	return (
		gulp
			.src(SCSS_SRC)
			.pipe(sourcemaps.init())
			.pipe(
				sass({
					outputStyle: "expanded"
				})
				.on("error", sass.logError)
			)
			.pipe(autoprefixer({
				cascade: false
			}))
			.pipe(sourcemaps.write("./map/"))
			.pipe(gulp.dest(CSS_DEST))
	);
});