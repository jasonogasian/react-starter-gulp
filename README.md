# react-starter-gulp
A gulp-powered ReactJs starter project inspired by [this tutorial](http://tylermcginnis.com/reactjs-tutorial-pt-2-building-react-applications-with-gulp-and-browserify/)

## Setup
1. Install nodeJs
	* [Node Installer](https://nodejs.org/en/download/)
	* With Homebrew (OSX) - `brew install node`
2. `npm install`
3. Build:
	* Development (watch for changes) - `gulp`
	* Production build - `gulp release'
4. How this project was created (*you don't need to do this*):
	* Install gulp globally - `npm install --global gulp`
	* `npm init`
	* `npm install --save-dev gulp`
	* `npm install --save-dev gulp-concat`
	* `npm install --save-dev gulp-uglify`
	* `npm install --save-dev gulp-react`
	* `npm install --save-dev gulp-html-replace`

## Gulp Goals
This Project uses gulp as a build tool to transpile JSX in JavaScript as well as
to create our production build.

#### Development Tasks:
* Transpile JSX into JS and save the output file into a dist/src folder.
* Copy index.html from the src folder into the dist folder.
* Watch for changes on JS or HTML files and do the above two steps again.

### Production Tasks:
* Concat all JS files, minify the result, then output to build.js to the build 
folder inside the dist folder.
* Replace all \<script\> tags in index.html with one \<script\> which references the 
new minified build.js file
