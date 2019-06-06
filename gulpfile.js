const gulp = require("gulp"),
  htmlmin = require("gulp-htmlmin"),
  minifyCss = require("gulp-minify-css"),
  sass = require("gulp-sass"),
  uglify = require("gulp-uglify"),
  babel = require("gulp-babel"),
  connect = require("gulp-connect");

gulp.task('default', () => {
   console.log("default");
 });

gulp.task("html", () => {
  gulp.src("src/**/*.html")
    .pipe(htmlmin({
      removeComments: true,//清除HTML注释
      collapseWhitespace: true,//压缩HTML
      collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input checked />
      removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
      removeScriptTypeAttributes: false,//删除<script>的type="text/javascript"
      removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
      minifyJS: true,//压缩页面JS
      minifyCSS: true//压缩页面CSS 
    }))
    .pipe(gulp.dest("dist"))
    .pipe(connect.reload());
})

gulp.task("css", () => {
  gulp.src("src/css/*.scss")
    .pipe(sass())
    .pipe(minifyCss())
    .pipe(gulp.dest("dist/css"))
    .pipe(connect.reload());
})

gulp.task("js", () => {
  gulp.src("src/js/**/*.js")
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(gulp.dest("dist/js"))
    .pipe(connect.reload());
})

gulp.task("lib" ,() => {
  gulp.src("src/libs/**/*")
    .pipe(gulp.dest("dist/libs"))
    .pipe(connect.reload());
})

gulp.task("img", () => {
  gulp.src("src/imgs/**/*")
    .pipe(gulp.dest("dist/imgs"))
    .pipe(connect.reload());
})

gulp.task("server", () => {
  connect.server({
    port: 8080,
    livereload : true,
    root: "dist"
  })
})

// 监听文件的改变，然后自动执行对应的任务
gulp.task("watch", () => {
  // 监听所有html文件的改变，他、然后执行html任务
  gulp.watch("src/**/*.html", ["html"]);
  gulp.watch("src/js/**/*.js", ["js"]);
  gulp.watch("src/css/**/*.scss", ["css"]);

})


gulp.task("default", ["html", "js", "css", "server", "lib", "img", "watch"]);
