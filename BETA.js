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
    };

    BETA.isNumber = function (val)
    {
        return (typeof val === "number" && !isNaN(val));
    };

    BETA.mod = function (x, y)
    {
        var r = x % y;
        return r < 0 ?
            r + y :
            r + 0; //adding +0 ensures no negative zeroes
    };
    
    //Clamps val to the range [a, b]
    BETA.clamp = function (val, a, b)
    {
        return a < b ?
            Math.max(a, Math.min(b, val)) :
            Math.max(b, Math.min(a, val));
    };

    BETA.randNum = function (a, b)
    {
        return a + Math.random() * (b - a);
    };

    BETA.randInt = function (a, b)
    {
        var min = (a < b) ? Math.ceil(a) : Math.ceil(b);
        var max = (a < b) ? Math.floor(b) : Math.floor(a);

        return (min > max) ?
            NaN :
            min + Math.floor(Math.random() * (1 + b - a));
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
    };

    BETA.rgba = function (red, green, blue, alpha)
    {
        alpha = (alpha !== undefined) ? alpha : 1;

        var color = Object.create(BETA.colorProto);
        color.r = BETA.rgbChannelConform(red);
        color.g = BETA.rgbChannelConform(green);
        color.b = BETA.rgbChannelConform(blue);
        color.a = BETA.clamp(alpha, 0, 1);
        return color;
    };

    BETA.rgb = function (red, green, blue)
    {
        return BETA.rgba(red, green, blue, 1);
    };

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
    };

    BETA.hsla = function (hue, saturation, lightness, alpha)
    {
        var h = BETA.mod(hue, 360) / 360;
        var s = BETA.clamp(saturation / 100, 0, 1);
        var l = BETA.clamp(lightness / 100, 0, 1);
        var r;
        var g;
        var b;

        if (saturation === 0)
        {
            var c = (l * 255);
            r = c;
            g = c;
            b = c;
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
    };

    BETA.hsl = function (hue, saturation, lightness)
    {
        return BETA.hsla(hue, saturation, lightness, 1);
    };

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
    };

    BETA.hsv = function (hue, saturation, value)
    {
        return BETA.hsva(hue, saturation, value, 1);
    };

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
        if (i % 2 === 1) { f = 1 - f; }
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
    };

    BETA.hwb = function (hue, whiteness, blackness)
    {
        return BETA.hwba(hue, whiteness, blackness, 1);
    };

    //------------VECTOR FUNCTIONS------------\\

    BETA.vector = function (x, y)
    {
        return { x: x, y: y };
    };

    BETA.v = BETA.vector;

    BETA.vCopy = function (v)
    {
        return { x: v.x, y: v.y };
    };

    BETA.vStringify = function (v)
    {
        return "(" + v.x + ", " + v.y + ")";
    };

    BETA.vAdd = function (v1, v2)
    {
        return {
            x: v1.x + v2.x,
            y: v1.y + v2.y
        };
    };

    BETA.vSubtract = function (v1, v2)
    {
        return {
            x: v1.x - v2.x,
            y: v1.y - v2.y
        };
    };

    BETA.vScale = function (v1, v2)
    {
        return {
            x: v1.x * v2.x,
            y: v1.y * v2.y
        };
    };

    BETA.vDot = function (v1, v2)
    {
        return v1.x * v2.x + v1.y * v2.y;
    };

    BETA.vScalarMult = function (v, s)
    {
        return {
            x: v.x * s,
            y: v.y * s
        };
    };

    BETA.vScalarDiv = function (v, s)
    {
        return {
            x: v.x / s,
            y: v.y / s
        };
    };

    BETA.vMagnitude = function (v)
    {
        return Math.sqrt(v.x * v.x + v.y * v.y);
    };

    BETA.vNormalize = function (v)
    {
        return (v.x === 0 && v.y === 0) ?
            v :
            BETA.vScalarDiv(v, BETA.vMagnitude(v));
    };

    BETA.vAngle = function (vec)
    {
        return Math.atan2(vec.y, vec.x) * (180 / Math.PI);
    };

    BETA.vFromPolar = function (radius, angle)
    {
        var radians = angle * (Math.PI / 180);
        return {
            x: Math.cos(radians) * radius,
            y: Math.sin(radians) * radius
        };
    };

    BETA.vDistance = function (v1, v2)
    {
        return BETA.vMagnitude(BETA.vSubtract(v1, v2));
    };

    BETA.vGridDist = function (v1, v2)
    {
        return Math.abs(v1.x - v2.x) + Math.abs(v1.y - v2.y);
    };

    BETA.vRotate = function (vec, pivot, angle)
    {
        var radians = angle * (Math.PI / 180);
        var sin = Math.sin(radians);
        var cos = Math.cos(radians);
        var dx = vec.x - pivot.x;
        var dy = vec.y - pivot.y;
        var rx = dx * cos - dy * sin;
        var ry = dx * sin + dy * cos;
        return {
            x: rx + pivot.x,
            y: ry + pivot.y
        };
    };

    //------------IMAGE FUNCTIONS-------------\\

    BETA.images = [];

    var loadingImgs = 0;

    var onAllLoaded = null;

    BETA.loadImage = function (url)
    {
        loadingImgs += 1;
        var img = document.createElement("img");
        img.onload = function ()
        {
            BETA.assert(img.naturalWidth > 0, "Image is broken, URL: " + url);
            loadingImgs -= 1;
            if (loadingImgs === 0 && typeof onAllLoaded === "function")
            {
                onAllLoaded();
                onAllLoaded = null;
            }
        };
        img.src = url;
        BETA.images.push(img);

        return img;
    };

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
    };

    //------------CANVAS INTERFACE------------\\

    var canvasRendererProto = {};

    BETA.getRenderer = function (id)
    {
        var canvas = document.getElementById(id);
        var context = canvas.getContext("2d");

        var renderer = Object.create(canvasRendererProto);
        renderer.id = id;
        renderer.canvas = canvas;
        renderer.context = context;
        renderer.width = canvas.width;
        renderer.height = canvas.height;
        renderer.size = { x: canvas.width, y: canvas.height };

        return renderer;
    };

    canvasRendererProto.resize = function (x, y)
    {
        this.width = x;
        this.height = y;
        this.size = { x: x, y: y };
        this.canvas.width = x;
        this.canvas.height = y;
        this.canvas.style.width = x + "px";
        this.canvas.style.height = y + "px";
    };

    canvasRendererProto.resizeByVector = function (vector)
    {
        this.resize(vector.x, vector.y);
    };

    canvasRendererProto.resizeToMax = function ()
    {
        this.resize(window.innerWidth, window.innerHeight);
    };

    canvasRendererProto.line = function (posA, posB, thickness, style)
    {
        this.context.strokeStyle = style;
        this.context.lineWidth = thickness;
        this.context.beginPath();
        this.context.moveTo(posA.x, posA.y);
        this.context.lineTo(posB.x, posB.y);
        this.context.stroke();
    };

    canvasRendererProto.fillCircle = function (pos, radius, style)
    {
        this.context.fillStyle = style;
        this.context.beginPath();
        this.context.arc(pos.x, pos.y, radius, 0, Math.PI * 2, true);
        this.context.fill();
    };

    canvasRendererProto.lineCircle = function (pos, radius, thickness, style)
    {
        this.context.strokeStyle = style;
        this.context.lineWidth = thickness;
        this.context.beginPath();
        this.context.arc(pos.x, pos.y, radius, 0, Math.PI * 2, true);
        this.context.stroke();
    };

    canvasRendererProto.fillSector = function (pos, radius, startAngle, endAngle, style)
    {
        var startRadians = startAngle * Math.PI / 180;
        var endRadians = endAngle * Math.PI / 180;

        //arcPointX/Y is where the arc starts, on the edge of the circle
        var arcPointX = pos.x + Math.cos(startRadians) * radius;
        var arcPointY = pos.y + Math.sin(startRadians) * radius;

        this.context.fillStyle = style;

        this.context.beginPath();
        this.context.moveTo(pos.x, pos.y);
        this.context.lineTo(arcPointX, arcPointY);
        this.context.arc(pos.x, pos.y, radius, startRadians, endRadians);
        this.context.fill();
    };

    canvasRendererProto.lineSector = function (pos, radius, startAngle, endAngle, thickness, style)
    {
        var startRadians = startAngle * Math.PI / 180;
        var endRadians = endAngle * Math.PI / 180;

        //arcPointX/Y is where the arc starts, on the edge of the circle
        var arcPointX = pos.x + Math.cos(startRadians) * radius;
        var arcPointY = pos.y + Math.sin(startRadians) * radius;

        this.context.strokeStyle = style;
        this.context.lineWidth = thickness;

        this.context.beginPath();
        this.context.moveTo(pos.x, pos.y);
        this.context.lineTo(arcPointX, arcPointY);
        this.context.arc(pos.x, pos.y, radius, startRadians, endRadians);
        this.context.closePath();
        this.context.stroke();
    };

    canvasRendererProto.arc = function (pos, radius, startAngle, endAngle, thickness, style)
    {
        var startRadians = startAngle * (Math.PI / 180);
        var endRadians = endAngle * (Math.PI / 180);

        this.context.strokeStyle = style;
        this.context.lineWidth = thickness;

        this.context.beginPath();
        this.context.arc(pos.x, pos.y, radius, startRadians, endRadians, false);
        this.context.stroke();
    };

    canvasRendererProto.fillRect = function (pos, size, style)
    {
        this.context.fillStyle = style;
        this.context.fillRect(pos.x, pos.y, size.x, size.y);
    };

    canvasRendererProto.lineRect = function (pos, size, thickness, style)
    {
        this.context.strokeStyle = style;
        this.context.lineWidth = thickness;
        this.context.strokeRect(pos.x, pos.y, size.x, size.y);
    };

    canvasRendererProto.fillPolygon = function (posArray, style)
    {
        this.context.fillStyle = style;
        if (posArray.length > 1)
        {
            this.context.beginPath();
            this.context.moveTo(posArray[0].x, posArray[0].y);
            for (var i = 1; i < posArray.length; i++)
            {
                this.context.lineTo(posArray[i].x, posArray[i].y);
            }
            this.context.fill();
        }
    };

    canvasRendererProto.linePolygon = function (posArray, thickness, style)
    {
        this.context.strokeStyle = style;
        this.context.lineWidth = thickness;
        if (posArray.length > 1)
        {
            this.context.beginPath();
            this.context.moveTo(posArray[0].x, posArray[0].y);
            for (var i = 1; i < posArray.length; i++)
            {
                this.context.lineTo(posArray[i].x, posArray[i].y);
            }
            this.context.closePath();
            this.context.stroke();
        }
    };

    canvasRendererProto.clear = function ()
    {
        this.context.clearRect(0, 0, this.width, this.height);
    };

    canvasRendererProto.clearRect = function (pos, size)
    {
        this.context.clearRect(pos.x, pos.y, size.x, size.y);
    };

    canvasRendererProto.fill = function (style)
    {
        this.fillRect({ x: 0, y: 0 }, this.size, style);
    };

    canvasRendererProto.drawImage = function (img, pos, size)
    {
        if (size)
        {
            this.context.drawImage(img, pos.x, pos.y, size.x, size.y);
        }
        else
        {
            this.context.drawImage(img, pos.x, pos.y);
        }
    };

    canvasRendererProto.text = function (pos, text, font, size, style)
    {
        this.context.font = size + "px " + font;
        this.context.fillStyle = style;
        this.context.fillText(text, pos.x, pos.y);
    };

    canvasRendererProto.translate = function (x, y)
    {
        this.context.translate(x, y);
    };

    canvasRendererProto.translateByVector = function (vector)
    {
        this.context.translate(vector.x, vector.y);
    };

    canvasRendererProto.scale = function (x, y)
    {
        this.context.scale(x, y);
    };

    canvasRendererProto.scaleByVector = function (vector)
    {
        this.context.scale(vector.x, vector.y);
    };

    canvasRendererProto.rotate = function (degrees)
    {
        this.context.rotate(degrees * Math.PI / 180);
    };

    canvasRendererProto.rotateRad = function (radians)
    {
        this.context.rotate(radians);
    };

    canvasRendererProto.save = function ()
    {
        this.context.save();
    };

    canvasRendererProto.restore = function ()
    {
        this.context.restore();
    };

    //------------ANIMATION SYSTEM------------\\

    var animations = {};

    BETA.animate = function (callback)
    {
        var prevTime;
        var frameId;
        var animId;

        frameId = requestAnimationFrame(function animationFn(time)
        {
            frameId = requestAnimationFrame(animationFn);
            animations[animId] = frameId;

            var deltaTime = prevTime ?
                (time - prevTime) / 1000
                : 0;

            callback({ time: time, deltaTime: deltaTime });

            prevTime = time;
        });

        animId = frameId;

        animations[animId] = frameId;

        return animId;
    };

    BETA.stopAnimation = function (id)
    {
        BETA.assert(animations[id], "There is no animation with ID " + id);

        cancelAnimationFrame(animations[id]);
        delete animations[id];
    };

    //-------------INPUT HANDLING-------------\\

    var keyCodes = {
        a: 65, b: 66, c: 67, d: 68, e: 69, f: 70, g: 71, h: 72, i: 73, j: 74, k: 75, l: 76, m: 77,
        n: 78, o: 79, p: 80, q: 81, r: 82, s: 83, t: 84, u: 85, v: 86, w: 87, x: 88, y: 89, z: 90,
        num0: 48, num1: 49, num2: 50, num3: 51, num4: 52, num5: 53, num6: 54, num7: 55, num8: 56, num9: 57,
        space: 32, enter: 13, tab: 9, esc: 27, backspace: 8, shift: 16, ctrl: 17, alt: 18,
        capslock: 20, numlock: 144, left: 37, up: 38, right: 39, down: 40, insert: 45, del: 46,
        f1: 112, f2: 113, f3: 114, f4: 115, f5: 116, f6: 117, f7: 118, f8: 119, f9: 120, f10: 121, f11: 122, f12: 123
    };

    var mouseBtns = {
        mouse1: 0, mouse2: 2, mouse3: 1, mouse4: 3, mouse5: 4
    };

    var keyStatuses = {};
    var mouseBtnStatuses = {};

    var keyDownHandlers = {};
    var mouseDownHandlers = {};

    var keyUpHandlers = {};
    var mouseUpHandlers = {};

    var mousePos = { x: 0, y: 0 };

    var inputInitiated = false;

    BETA.initInput = function ()
    {
        inputInitiated = true;

        document.addEventListener("keydown", function (event)
        {
            var kc = event.keyCode;
            if (!keyStatuses[kc]) //prevents repeat when button is held
            {
                keyStatuses[kc] = true;
                if (keyDownHandlers.hasOwnProperty(kc))
                {
                    event.preventDefault();
                    keyDownHandlers[kc](event);
                }
            }
        }, false);

        document.addEventListener("mousedown", function (event)
        {
            var btn = event.button;
            mouseBtnStatuses[btn] = true;
            if (mouseDownHandlers.hasOwnProperty(btn))
            {
                event.preventDefault();
                mouseDownHandlers[btn](event);
            }
        }, false);

        document.addEventListener("keyup", function (event)
        {
            var kc = event.keyCode;
            keyStatuses[kc] = false;
            if (keyUpHandlers.hasOwnProperty(kc))
            {
                event.preventDefault();
                keyUpHandlers[kc](event);
            }
        }, false);

        document.addEventListener("mouseup", function (event)
        {
            var btn = event.button;
            mouseBtnStatuses[btn] = false;
            if (mouseUpHandlers.hasOwnProperty(btn))
            {
                event.preventDefault();
                mouseUpHandlers[btn](event);
            }
        }, false);

        document.addEventListener("mousemove", function (event)
        {
            mousePos.x = event.clientX;
            mousePos.y = event.clientY;
        }, false);
    };

    BETA.isButtonDown = function (button)
    {
        BETA.assert(inputInitiated, "isButtonDown(): You haven't initiated the input system yet!");
        var btn = button.toLowerCase();
        if (keyCodes.hasOwnProperty(btn))
        {
            return !!keyStatuses[keyCodes[btn]];
        }
        else if (mouseBtns.hasOwnProperty(btn))
        {
            return !!mouseBtnStatuses[mouseBtns[btn]];
        }
        throw new Error("isButtonDown(): Unknown button '" + button + "'");
    };

    BETA.onButtonDown = function (button, callback)
    {
        BETA.assert(inputInitiated, "onButtonDown(): You haven't initiated the input system yet!");
        var btn = button.toLowerCase();
        if (keyCodes.hasOwnProperty(btn))
        {
            keyDownHandlers[keyCodes[btn]] = callback;
        }
        else if (mouseBtns.hasOwnProperty(btn))
        {
            mouseDownHandlers[mouseBtns[btn]] = callback;
        }
        else
        {
            throw new Error("onButtonDown(): Unknown button '" + button + "'");
        }
    };

    BETA.onButtonUp = function (button, callback)
    {
        BETA.assert(inputInitiated, "onButtonUp(): You haven't initiated the input system yet!");
        var btn = button.toLowerCase();
        if (keyCodes.hasOwnProperty(btn))
        {
            keyUpHandlers[keyCodes[btn]] = callback;
        }
        else if (mouseBtns.hasOwnProperty(btn))
        {
            mouseUpHandlers[mouseBtns[btn]] = callback;
        }
        else
        {
            throw new Error("onButtonUp(): Unknown button '" + button + "'");
        }
    };

    canvasRendererProto.getMousePos = function ()
    {
        BETA.assert(inputInitiated, "getMousePos(): You haven't initiated the input system yet!");
        var rect = this.canvas.getBoundingClientRect();
        return {
            x: Math.round(mousePos.x - rect.left),
            y: Math.round(mousePos.y - rect.top)
        };
    };
}());
