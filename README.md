# YodaQA Client
Client for YodaQA writen in HTML5 with jQuery mobile and Cordova.

You can see it live on http://brmson.github.io/YodaQA-client/ .
That's the gh-pages branch; to push there, use:
	
	git subtree push --prefix www origin gh-pages

## Structure

### HTML page
Client itself is located in `www` folder. There is `index.html`. 

Javascript files are in `www/js`. 
File `yodaAnswerGetter.js` handles getting of answers and their displaying.
File `androidControl.js` handles native android functions.
jQuerry mobile is located in `www/js/jQuery`.

CSS files are located in `www/css`. `style.css` contains custom stylesheet. jQuery mobile css files are located in `www/css/jQuery`.

### Android app
Files genrated by Cordova for android app are located in `platforms\android`. Current apk file is in `platforms\android\build\outputs\apk`. There are Cordova plugins in `plugins` folder.

## API

  * ``?qID=N``: show question with id N
  * ``?e=http://qa.ailao.eu:4000/``: use a non-default REST API endpoint
