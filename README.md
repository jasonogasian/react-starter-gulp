# react-starter-gulp
A gulp-powered ReactJs starter project inspired by [this tutorial](http://tylermcginnis.com/reactjs-tutorial-pt-2-building-react-applications-with-gulp-and-browserify/)

## Setup
1. Install nodeJs
	* [Node Installer](https://nodejs.org/en/download/)
	* With Homebrew (OSX) - `brew install node`
2. `npm install`
3. Build:
	* Development (watch for changes) - `gulp` or `gulp serve` to run a local server that will reload live!
	* Production build - `gulp release`

## Gulp Goals
This Project uses gulp as a build tool to transpile JSX in JavaScript, translate
ES6 into browser-supported JS, compile SASS, as well as to create our production build.

### Development Tasks:
* Copy index.html from the src folder into the build folder.
* Resolve commonJS require statements (browserify)
* Transpile JSX into JS and save the output file into a build/src folder (babelify).
	* **Note:** I chose *babelify* over *reactify* due to its better ES6 support
* Compile SASS and partials into CSS (gulp-sass).
* Watch for changes on JS or HTML files and do the above steps again (watchify).
* Create sourcemaps so that we can see our JS files and SASS line numbers in the debugger (gulp-sourcemaps).

### Production Tasks:
* Similar to development tasks with additional steps
* Minify JS sent to the release folder
* Compress resulting CSS
* Replace all \<script\> tags in index.html with one \<script\> which references the new minified build.js file
