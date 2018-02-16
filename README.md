# PostHTML-bem
[![Build Status](https://travis-ci.org/wearemetabolism/posthtml-bem.svg?branch=master)](https://travis-ci.org/wearemetabolism/posthtml-bem.svg?branch=master)

[PostHTML](https://github.com/posthtml/posthtml) plugin for support to simplify the maintenance of [BEM](http://bem.info) naming structure in html


## Install

```
$ npm install --save-dev posthtml-bem
```


##Features

### Blocks

```html
<div block="MadTeaParty">
    Mad Tea Party
</div>
```

This would render like

```html
<div class="MadTeaParty">
    Mad Tea Party
</div>
```


### Elements

```html
<div block="MadTeaParty">
    <div element="march_hare">March Hare</div>
</div>
```

This would render like

```html
<div class="MadTeaParty">
    <div class="MadTeaParty__march_hare">March Hare</div>
</div>
```

### Modifiers

_**Attention:** Please use "mods" for the attribute modifiers instead of "mod" and a space as a separator of modifiers instead of a comma._

```html
<div block="MadTeaParty">
    <div element="march_hare" mod="mad">March Hare</div>
</div>
```


This would render like

```html
<div class="MadTeaParty">
    <div class="MadTeaParty__march_hare MadTeaParty__march_hare--mad">
        March Hare
    </div>
</div>
```

### Native class support

Native classes are supplemented by BEM classes

```html
<div block="animal" class="clearfix grid">
    <div element="nose" mod="long" class="clearfix grid">Nose</div>
</div>
```

This would render like

```html
<div class="animal clearfix grid">
    <div class="animal__nose animal__nose--long clearfix grid">Nose</div>
</div>
```



## Usage

```javascript
var posthtml = require('posthtml'),
    config = {
        elemPrefix: '__',
        modPrefix: '--'
    },
    html = '<div block="mad-tea-party"><div element="march_hare" mod="mad">March Hare</div><div element="hatter" mod="type:mad">Hatter</div><div element="dormouse" mod="sleepy">Dormouse</div></div>';

posthtml()
    .use(require('posthtml-bem')(config))
    .process(html)
    .then(function (result) {
        console.log(result.html);
    });
```

## With Webpack

```javascript

let config = {
    ...
    module: {
        rules: [
            {
                test: /\.html/,
                use: [
                    {
                        loader: 'html-loader',
                        options: {
                            minimize: false
                        }
                    },
                    {
                        loader: 'posthtml-loader',
                        options: {
                            ident: 'posthtml',
                            plugins: [
                                require('posthtml-bem')()
                            ]
                        }
                    }
                ]
            }
            ...
};

module.exports = config;

```

## With Gulp

```javascript
var gulp = require('gulp'),
    rename = require('gulp-rename'),
    posthtml = require('gulp-posthtml');

gulp.task('default', function () {
    return gulp.src('before.html')
        .pipe(posthtml([
            require('posthtml-bem')({
                elemPrefix: '__',
                modPrefix: '--'
            })
        ]))
    .pipe(rename('after.html'))
    .pipe(gulp.dest('.'));
});
```

## With Jade and Gulp

jade template
```html
div(block='animals')
    div(element='rabbit' mod='scurrying white')
    div(element='dormouse' mod='sleeper red')
```
## Predecessors

This plugin was inspired by the syntax and the idea of using custom attributes from [BEML](https://github.com/zenwalker/node-beml) and [bemto](https://github.com/kizu/bemto).
This is a fork of [rajdee/posthtml-bem](https://github.com/rajdee/posthtml-bem)

## License

MIT
