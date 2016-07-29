## BETA.js
A simple canvas-based JavaScript library for game prototyping and graphical experiments.

The aim of this library is to reduce the amount of boring setup code required in graphics projects,
as well as to save developers from having to interact with the DOM API,
because *I value the health and sanity of developers.*

### Visit [the Wiki](https://github.com/CookieShade/BETA.js/wiki) for documentation

### Requirements
A relatively modern browser, although no cutting-edge features are used.  
Tested to work on Chrome 51 and Firefox 47.

*Should* also work on:  
- Chrome 24+  
- Firefox 23+  
- Internet Explorer 10+  
- Opera 15+  
- Safari 6.1+

### Getting started
```html
<body style="margin: 0">
    <canvas id="myCanvas"></canvas>
    <script src="https://sudonet.net/beta/latest/beta.js"></script>
    <script>
        // The library is now defined in the global BETA variable.
        var renderer = BETA.getRenderer("myCanvas");
        renderer.resizeToMax();

        renderer.fill("Black");

        renderer.text({x: 100, y: 80}, "Hello World!", "Arial", 25, "White");
    </script>
</body>
```

If you want to use an older version, or make sure to always use the same version, see
[the Wiki section](https://github.com/CookieShade/BETA.js/wiki#usage) for other alternatives.

---
The API aims to be:
- Simple
- Easy to learn
- Lightweight

It does not attempt to:
- Support all browsers, past, present and future
- Replace standard APIs completely
- Think for you

BETA.js is a library, not a framework.

### Distributed under [the MIT license](https://github.com/CookieShade/BETA.js/blob/master/LICENSE.txt)

##### BEtter Than Advanced.js

Thanks to Mikael Tylmad and Pontus Walck for creating [advanced.js](https://github.com/datorklubben/Spelprogrammering-med-JavaScript-och-Canvas), the primary inspiration for this library.
