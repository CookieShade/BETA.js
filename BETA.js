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

    //------------COLOR FUNCTIONS-----------\\

    BETA.colorProto = {
        toString: function ()
        {
            return (this.a >= 1) ?
                "rgb(" + this.r + "," + this.g + "," + this.b + ")" :
                "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
        }
    };

    BETA.rgba = function (red, green, blue, alpha)
    {
        var color = Object.create(BETA.colorProto);
        color.r = red;
        color.g = green;
        color.b = blue;
        color.a = (alpha !== undefined) ? alpha : 1;
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
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p * 255;
    }

    BETA.hsla = function (h, s, l, a)
    {
        var r;
        var g;
        var b;

        if (s == 0)
        {
            r = g = b = l; // achromatic
        }
        else
        {
            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;

            r = BETA.hueToRgbChannel(p, q, h + 1 / 3);
            g = BETA.hueToRgbChannel(p, q, h);
            b = BETA.hueToRgbChannel(p, q, h - 1 / 3);
        }

        return BETA.rgba(r, g, b, a);
    }

    BETA.hsl = function (h, s, l)
    {
        return BETA.hsla(h, s, l, 1);
    }

    BETA.hsva = function (h, s, v, a)
    {
        var r;
        var g;
        var b;

        var i = Math.floor(h * 6);
        var f = h * 6 - i;
        var p = v * (1 - s);
        var q = v * (1 - f * s);
        var t = v * (1 - (1 - f) * s);

        switch (i % 6)
        {
            case 0: r = v, g = t, b = p; break;
            case 1: r = q, g = v, b = p; break;
            case 2: r = p, g = v, b = t; break;
            case 3: r = p, g = q, b = v; break;
            case 4: r = t, g = p, b = v; break;
            case 5: r = v, g = p, b = q; break;
        }

        return BETA.rgba(r * 255, b * 255, c * 255, a);
    }

    BETA.hsv = function (h, s, v)
    {
        return BETA.hsva(h, s, v, 1);
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
