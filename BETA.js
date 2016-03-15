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

    //------------COLOR FUNCTIONS-----------\\

    BETA.colorProto = {
        toString: function ()
        {
            return (this.a >= 1) ?
                "rgb(" + this.r + "," + this.g + "," + this.b + ")" :
                "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
        }
    };

    BETA.rgbChannelConform = function (val)
    {
        return Math.max(0, Math.min(255, Math.round(val)));
    }

    BETA.zeroOneClamp = function (val)
    {
        return Math.max(0, Math.min(1, val));
    }

    BETA.rgba = function (red, green, blue, alpha)
    {
        alpha = (alpha !== undefined) ? alpha : 1;

        var color = Object.create(BETA.colorProto);
        color.r = BETA.rgbChannelConform(red);
        color.g = BETA.rgbChannelConform(green);
        color.b = BETA.rgbChannelConform(blue);
        color.a = BETA.zeroOneClamp(alpha);
        return color;
    }

    BETA.rgb = function (red, green, blue)
    {
        return BETA.rgba(red, green, blue, 1);
    }

    //HSL and HSV conversions made by GitHub user mjackson
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
        hue = BETA.mod(hue, 360) / 360;
        saturation = BETA.zeroOneClamp(saturation);
        lightness = BETA.zeroOneClamp(lightness);
        alpha = BETA.zeroOneClamp(alpha);
        var r;
        var g;
        var b;

        if (saturation == 0)
        {
            r = g = b = lightness; // achromatic
        }
        else
        {
            var q = lightness < 0.5 ? lightness * (1 + saturation) : lightness + saturation - lightness * saturation;
            var p = 2 * lightness - q;

            r = BETA.hueToRgbChannel(p, q, hue + 1 / 3);
            g = BETA.hueToRgbChannel(p, q, hue);
            b = BETA.hueToRgbChannel(p, q, hue - 1 / 3);
        }

        return BETA.rgba(r, g, b, alpha);
    }

    BETA.hsl = function (hue, saturation, lightness)
    {
        return BETA.hsla(hue, saturation, lightness, 1);
    }

    BETA.hsva = function (hue, saturation, value, alpha)
    {
        hue = BETA.mod(hue, 360) / 360;
        saturation = BETA.zeroOneClamp(saturation);
        value = BETA.zeroOneClamp(value);
        alpha = BETA.zeroOneClamp(alpha);
        var r;
        var g;
        var b;

        var i = Math.floor(hue * 6);
        var f = hue * 6 - i;
        var p = value * (1 - saturation);
        var q = value * (1 - f * saturation);
        var t = value * (1 - (1 - f) * saturation);

        switch (i % 6)
        {
            case 0: r = value; g = t; b = p; break;
            case 1: r = q; g = value; b = p; break;
            case 2: r = p; g = value; b = t; break;
            case 3: r = p; g = q; b = value; break;
            case 4: r = t; g = p; b = value; break;
            case 5: r = value; g = p; b = q; break;
        }

        return BETA.rgba(r * 255, b * 255, g * 255, alpha);
    }

    BETA.hsv = function (hue, saturation, value)
    {
        return BETA.hsva(hue, saturation, value, 1);
    }

    //Adapted from http://alvyray.com/Papers/CG/hwb2rgb.htm
    BETA.hwba = function (hue, whiteness, blackness, alpha)
    {
        var h = BETA.mod(hue, 360) / 60;
        var w = BETA.zeroOneClamp(whiteness);
        var b = BETA.zeroOneClamp(blackness);
        var red;
        var green;
        var blue;

        var v = 1 - b;
        var i = Math.floor(h);
        var f = h - i;
        if (i % 2) { f = 1 - f; }
        var n = w + f * (v - w);

        switch (i)
        {
            case 0: red = v; green = n; blue = w; break;
            case 1: red = n; green = v; blue = w; break;
            case 2: red = w; green = v; blue = n; break;
            case 3: red = w; green = n; blue = v; break;
            case 4: red = n; green = w; blue = v; break;
            case 5: red = v; green = w; blue = n; break
        }
        return BETA.rgba(red * 255, green * 255, blue * 255);
    }

    BETA.hwb = function (hue, whiteness, blackness)
    {
        return BETA.hwba(hue, whiteness, blackness);
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
    };

    BETA.v = BETA.vector;

    BETA.vStringify = function (v)
    {
        return "(" + v.x + ", " + v.y + ")";
    };

    BETA.vAdd = function (v1, v2)
    {
        return BETA.v(v1.x + v2.x, v1.y + v2.y);
    };

    BETA.vSubtract = function (v1, v2)
    {
        return BETA.v(v1.x - v2.x, v1.y - v2.y);
    };

    BETA.vScale = function (v1, v2)
    {
        return BETA.v(v1.x * v2.x, v1.y * v2.y);
    };

    BETA.vDot = function (v1, v2)
    {
        return v1.x * v2.x + v1.y * v2.y;
    };

    BETA.vScalarMult = function (v, s)
    {
        return BETA.v(v.x * s, v.y * s);
    };

    BETA.vScalarDiv = function (v, s)
    {
        return BETA.v(v.x / s, v.y / s);
    };

    BETA.vMagnitude = function (v)
    {
        return Math.sqrt(v.x * v.x + v.y * v.y);
    };

    BETA.vNormalize = function (v)
    {
        return (v.x === 0 && v.y === 0) ? v : BETA.vScalarDiv(v, BETA.vMagnitude(v));
    };

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
    };

    BETA.Canvas.prototype.resize = function (x, y)
    {
        this.width = x;
        this.height = y;
        this.sizeVector = BETA.v(x, y);
        this.canvas.width = x;
        this.canvas.height = y;
        this.canvas.style.width = x + "px";
        this.canvas.style.height = y + "px";
    };

    BETA.Canvas.prototype.vectorResize = function (vector)
    {
        this.width = vector.x;
        this.height = vector.y;
        this.sizeVector = BETA.v(vector.x, vector.y);
        this.canvas.width = vector.x;
        this.canvas.height = vector.y;
        this.canvas.style.width = vector.x + "px";
        this.canvas.style.height = vector.y + "px";
    };

    BETA.Canvas.prototype.line = function (posA, posB, thickness, style)
    {
        this.context.strokeStyle = style;
        this.context.lineWidth = thickness;
        this.context.beginPath();
        this.context.moveTo(posA.x, posA.y);
        this.context.lineTo(posB.x, posB.y);
        this.context.stroke();
        this.context.closePath();
    };

    BETA.Canvas.prototype.rect = function (pos, size, style)
    {
        this.context.fillStyle = style;
        this.context.fillRect(pos.x, pos.y, size.x, size.y);
    };

    BETA.Canvas.prototype.lineRect = function (pos, size, thickness, style)
    {
        this.context.strokeStyle = style;
        this.context.lineWidth = thickness;
        this.context.strokeRect(pos.x, pos.y, size.x, size.y);
    };

    BETA.Canvas.prototype.translate = function (x, y)
    {
        this.context.translate(x, y);
    };

    BETA.Canvas.prototype.vectorTranslate = function (vector)
    {
        this.context.translate(vector.x, vector.y);
    };

    BETA.Canvas.prototype.scale = function (x, y)
    {
        this.context.scale(x, y);
    };

    BETA.Canvas.prototype.vectorScale = function (vector)
    {
        this.context.scale(vector.x, vector.y);
    };

    BETA.Canvas.prototype.rotate = function (degrees)
    {
        this.context.rotate(degrees * Math.PI / 180);
    };

    BETA.Canvas.prototype.rotateRad = function (radians)
    {
        this.context.rotate(radians);
    };

    BETA.Canvas.prototype.save = function ()
    {
        this.context.save();
    };

    BETA.Canvas.prototype.restore = function ()
    {
        this.context.restore();
    };

})();
