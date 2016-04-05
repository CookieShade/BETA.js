/*
  BETA.js - BEtter Than Advanced.js
  by Erik "CookieShade" Bivrin

  Comments in english explain the code,
  comments in swedish are the dev's notes to himself
*/

(function ()
{
    "use strict";
    window.BETA = {};

    BETA.assert = function (assertion, message)
    {
        if (!assertion)
        {
            var msg = (message) ?
                "Assertion failed: " + message :
                "Assertion failed.";
            throw new Error(msg);
        }
    }

    BETA.isNumber = function (val)
    {
        return (typeof val === "number" && !isNaN(val));
    }

    BETA.mod = function (x, y)
    {
        var r = x % y;
        return r < 0 ?
            r + y :
            r + 0; //adding +0 ensures no negative zeroes
    }
    
    //Clamps val to the range [a, b]
    BETA.clamp = function (val, a, b)
    {
        return a < b ?
            Math.max(a, Math.min(b, val)) :
            Math.max(b, Math.min(a, val));
    }

    //------------COLOR FUNCTIONS-----------\\

    BETA.colorProto = {
        toString: function ()
        {
            return (this.a >= 1) ?
                "rgb(" + this.r + ", " + this.g + ", " + this.b + ")" :
                "rgba(" + this.r + ", " + this.g + ", " + this.b + ", " + this.a + ")";
        }
    };

    BETA.rgbChannelConform = function (val)
    {
        return Math.max(0, Math.min(255, Math.round(val)));
    }

    BETA.rgba = function (red, green, blue, alpha)
    {
        alpha = (alpha !== undefined) ? alpha : 1;

        var color = Object.create(BETA.colorProto);
        color.r = BETA.rgbChannelConform(red);
        color.g = BETA.rgbChannelConform(green);
        color.b = BETA.rgbChannelConform(blue);
        color.a = BETA.clamp(alpha, 0, 1);
        return color;
    }

    BETA.rgb = function (red, green, blue)
    {
        return BETA.rgba(red, green, blue, 1);
    }

    //HSL conversion made by GitHub user mjackson
    //https://gist.github.com/mjackson/5311256
    BETA.hueToRgbChannel = function (p, q, t)
    {
        var ret;
        if (t < 0) { t += 1; }
        if (t > 1) { t -= 1; }

        if (t < 1 / 6) { ret = (p + (q - p) * 6 * t); }
        else if (t < 1 / 2) { ret = q; }
        else if (t < 2 / 3) { ret = (p + (q - p) * (2 / 3 - t) * 6); }
        else { ret = p; }
        return ret * 255;
    }

    BETA.hsla = function (hue, saturation, lightness, alpha)
    {
        var h = BETA.mod(hue, 360) / 360;
        var s = BETA.clamp(saturation / 100, 0, 1);
        var l = BETA.clamp(lightness / 100, 0, 1);
        var r;
        var g;
        var b;

        if (saturation == 0)
        {
            r = g = b = (l * 255); // achromatic
        }
        else
        {
            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;

            r = BETA.hueToRgbChannel(p, q, h + 1 / 3);
            g = BETA.hueToRgbChannel(p, q, h);
            b = BETA.hueToRgbChannel(p, q, h - 1 / 3);
        }

        return BETA.rgba(r, g, b, alpha);
    }

    BETA.hsl = function (hue, saturation, lightness)
    {
        return BETA.hsla(hue, saturation, lightness, 1);
    }

    //Adapted from http://alvyray.com/Papers/CG/hsv2rgb.htm
    BETA.hsva = function (hue, saturation, value, alpha)
    {
        var h = BETA.mod(hue, 360) / 60;
        var s = BETA.clamp(saturation / 100, 0, 1);
        var v = BETA.clamp(value / 100, 0, 1);
        var red;
        var green;
        var blue;

        var i = Math.floor(h);
        var f = h - i;
        if (i % 2 === 0) { f = 1 - f; }
        var m = v * (1 - s);
        var n = v * (1 - s * f);

        switch (i)
        {
            case 0: red = v; green = n; blue = m; break;
            case 1: red = n; green = v; blue = m; break;
            case 2: red = m; green = v; blue = n; break;
            case 3: red = m; green = n; blue = v; break;
            case 4: red = n; green = m; blue = v; break;
            case 5: red = v; green = m; blue = n; break;
        }
        return BETA.rgba(red * 255, green * 255, blue * 255, alpha);
    }

    BETA.hsv = function (hue, saturation, value)
    {
        return BETA.hsva(hue, saturation, value, 1);
    }

    //Adapted from http://alvyray.com/Papers/CG/hwb2rgb.htm
    BETA.hwba = function (hue, whiteness, blackness, alpha)
    {
        var h = BETA.mod(hue, 360) / 60;
        var w = Math.max(0, whiteness / 100);
        var b = Math.max(0, blackness / 100);
        var sum = w + b;
        if (sum > 1) { w = w / sum; b = b / sum; }

        var red;
        var green;
        var blue;

        var v = 1 - b;
        var i = Math.floor(h);
        var f = h - i;
        if (i % 2) {f = 1 - f;}
        var n = w + f * (v - w);

        switch (i)
        {
            case 0: red = v; green = n; blue = w; break;
            case 1: red = n; green = v; blue = w; break;
            case 2: red = w; green = v; blue = n; break;
            case 3: red = w; green = n; blue = v; break;
            case 4: red = n; green = w; blue = v; break;
            case 5: red = v; green = w; blue = n; break;
        }
        return BETA.rgba(red * 255, green * 255, blue * 255, alpha);
    }

    BETA.hwb = function (hue, whiteness, blackness)
    {
        return BETA.hwba(hue, whiteness, blackness, 1);
    }

    //------------VECTOR FUNCTIONS------------\\

    BETA.vProto = {
        toString: function ()
        {
            return BETA.vStringify(this);
        }
    };

    BETA.vector = function (x, y)
    {
        //Vectors inherit .toString() from vProto
        var v = Object.create(BETA.vProto);
        v.x = x;
        v.y = y;
        return v;
    }

    BETA.v = BETA.vector;

    BETA.vStringify = function (v)
    {
        return "(" + v.x + ", " + v.y + ")";
    }

    BETA.vAdd = function (v1, v2)
    {
        return BETA.v(v1.x + v2.x, v1.y + v2.y);
    }

    BETA.vSubtract = function (v1, v2)
    {
        return BETA.v(v1.x - v2.x, v1.y - v2.y);
    }

    BETA.vScale = function (v1, v2)
    {
        return BETA.v(v1.x * v2.x, v1.y * v2.y);
    }

    BETA.vDot = function (v1, v2)
    {
        return v1.x * v2.x + v1.y * v2.y;
    }

    BETA.vScalarMult = function (v, s)
    {
        return BETA.v(v.x * s, v.y * s);
    }

    BETA.vScalarDiv = function (v, s)
    {
        return BETA.v(v.x / s, v.y / s);
    }

    BETA.vMagnitude = function (v)
    {
        return Math.sqrt(v.x * v.x + v.y * v.y);
    }

    BETA.vNormalize = function (v)
    {
        return (v.x === 0 && v.y === 0) ? v : BETA.vScalarDiv(v, BETA.vMagnitude(v));
    }

    //------------IMAGE FUNCTIONS-------------\\

    BETA.images = [];

    var loadingImgs = 0;

    BETA.loadImage = function (url)
    {
        loadingImgs++;
        var img = document.createElement("img");
        img.onload = function ()
        {
            BETA.assert(img.naturalWidth > 0, "Image is broken, URL: " + url);
            loadingImgs--;
            if (loadingImgs === 0 && typeof onAllLoaded === "function")
            {
                onAllLoaded();
                onAllLoaded = null;
            }
        }
        img.src = url;
        BETA.images.push(img);

        return img;
    }

    var onAllLoaded = null;

    BETA.waitForImgLoad = function (callback)
    {
        if (loadingImgs === 0)
        {
            callback();
        }
        else
        {
            onAllLoaded = callback;
        }
    }

    //------------CANVAS INTERFACE------------\\

    BETA.Canvas = function (id)
    {
        var cvs = document.getElementById(id);
        var ctx = cvs.getContext("2d");

        this.id = id;
        this.canvas = cvs;
        this.context = ctx;
        this.width = cvs.width;
        this.height = cvs.height;
        this.sizeVector = BETA.v(cvs.width, cvs.height);
    }

    BETA.Canvas.prototype.resize = function (x, y)
    {
        this.width = x;
        this.height = y;
        this.sizeVector = BETA.v(x, y);
        this.canvas.width = x;
        this.canvas.height = y;
        this.canvas.style.width = x + "px";
        this.canvas.style.height = y + "px";
    }

    BETA.Canvas.prototype.vectorResize = function (vector)
    {
        this.width = vector.x;
        this.height = vector.y;
        this.sizeVector = BETA.v(vector.x, vector.y);
        this.canvas.width = vector.x;
        this.canvas.height = vector.y;
        this.canvas.style.width = vector.x + "px";
        this.canvas.style.height = vector.y + "px";
    }

    BETA.Canvas.prototype.line = function (posA, posB, thickness, style)
    {
        this.context.strokeStyle = style;
        this.context.lineWidth = thickness;
        this.context.beginPath();
        this.context.moveTo(posA.x, posA.y);
        this.context.lineTo(posB.x, posB.y);
        this.context.stroke();
        this.context.closePath();
    }

    BETA.Canvas.prototype.rect = function (pos, size, style)
    {
        this.context.fillStyle = style;
        this.context.fillRect(pos.x, pos.y, size.x, size.y);
    }

    BETA.Canvas.prototype.lineRect = function (pos, size, thickness, style)
    {
        this.context.strokeStyle = style;
        this.context.lineWidth = thickness;
        this.context.strokeRect(pos.x, pos.y, size.x, size.y);
    }

    BETA.Canvas.prototype.drawImage = function (img, pos, size)
    {
        if (size)
        {
            this.context.drawImage(img, pos.x, pos.y, size.x, size.y);
        }
        else
        {
            this.context.drawImage(img, pos.x, pos.y);
        }
    }

    BETA.Canvas.prototype.translate = function (x, y)
    {
        this.context.translate(x, y);
    }

    BETA.Canvas.prototype.vectorTranslate = function (vector)
    {
        this.context.translate(vector.x, vector.y);
    }

    BETA.Canvas.prototype.scale = function (x, y)
    {
        this.context.scale(x, y);
    }

    BETA.Canvas.prototype.vectorScale = function (vector)
    {
        this.context.scale(vector.x, vector.y);
    }

    BETA.Canvas.prototype.rotate = function (degrees)
    {
        this.context.rotate(degrees * Math.PI / 180);
    }

    BETA.Canvas.prototype.rotateRad = function (radians)
    {
        this.context.rotate(radians);
    }

    BETA.Canvas.prototype.save = function ()
    {
        this.context.save();
    }

    BETA.Canvas.prototype.restore = function ()
    {
        this.context.restore();
    }

})();
