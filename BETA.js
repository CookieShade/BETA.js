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
            NaN : //happens when [a, b] contains no integers
            min + Math.floor(Math.random() * (1 + max - min));
    };

    BETA.randElement = function (arr)
    {
        return arr[Math.floor(Math.random() * arr.length)];
    };

    //------------COLOR FUNCTIONS-----------\\

    var colorProto = {
        toString: function ()
        {
            return (this.a >= 1) ?
                "rgb(" + this.r + ", " + this.g + ", " + this.b + ")" :
                "rgba(" + this.r + ", " + this.g + ", " + this.b + ", " + this.a + ")";
        }
    };

    function rgbChannelConform(val)
    {
        return Math.max(0, Math.min(255, Math.round(val)));
    }

    BETA.rgba = function (red, green, blue, alpha)
    {
        alpha = (alpha !== undefined) ? alpha : 1;

        var color = Object.create(colorProto);
        color.r = rgbChannelConform(red);
        color.g = rgbChannelConform(green);
        color.b = rgbChannelConform(blue);
        color.a = BETA.clamp(alpha, 0, 1);
        return color;
    };

    BETA.rgb = function (red, green, blue)
    {
        return BETA.rgba(red, green, blue, 1);
    };

    function hueToRgbChannel(m1, m2, h)
    {
        if (h < 0) { h += 1; }
        if (h > 1) { h -= 1; }
        if (h * 6 < 1) { return m1 + (m2 - m1) * h * 6; }
        if (h * 2 < 1) { return m2; }
        if (h * 3 < 2) { return m1 + (m2 - m1) * (2 / 3 - h) * 6; }
        return m1;
    }

    BETA.hsla = function (hue, saturation, lightness, alpha)
    {
        var h = BETA.mod(hue, 360) / 360;
        var s = BETA.clamp(saturation, 0, 100) / 100;
        var l = BETA.clamp(lightness, 0, 100) / 100;

        var m2 = (l <= 0.5) ? l * (s + 1) : l + s - l * s;
        var m1 = l * 2 - m2;
        var r = hueToRgbChannel(m1, m2, h + 1 / 3);
        var g = hueToRgbChannel(m1, m2, h);
        var b = hueToRgbChannel(m1, m2, h - 1 / 3);

        return BETA.rgba(r * 255, g * 255, b * 255, alpha);
    };

    BETA.hsl = function (hue, saturation, lightness)
    {
        return BETA.hsla(hue, saturation, lightness, 1);
    };

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

    BETA.vEquals = function (v1, v2)
    {
        return (v1.x === v2.x && v1.y === v2.y && typeof v1.x === "number" && typeof v1.y === "number");
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

    BETA.vComplexMult = function (v1, v2)
    {
        return {
            x: v1.x * v2.x - v1.y * v2.y,
            y: v1.x * v2.y + v2.x * v1.y
        };
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

    var images = [];

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
        images.push(img);

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
        BETA.assert(canvas instanceof HTMLCanvasElement, "getRenderer(): Element #" + id + " is not a <canvas>");
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

    canvasRendererProto.line = function (posA, posB, thickness, color)
    {
        this.context.strokeStyle = color;
        this.context.lineWidth = thickness;
        this.context.beginPath();
        this.context.moveTo(posA.x, posA.y);
        this.context.lineTo(posB.x, posB.y);
        this.context.stroke();
    };

    canvasRendererProto.fillCircle = function (pos, radius, color)
    {
        this.context.fillStyle = color;
        this.context.beginPath();
        this.context.arc(pos.x, pos.y, radius, 0, Math.PI * 2, true);
        this.context.fill();
    };

    canvasRendererProto.lineCircle = function (pos, radius, thickness, color)
    {
        this.context.strokeStyle = color;
        this.context.lineWidth = thickness;
        this.context.beginPath();
        this.context.arc(pos.x, pos.y, radius, 0, Math.PI * 2, true);
        this.context.stroke();
    };

    canvasRendererProto.fillSector = function (pos, radius, startAngle, endAngle, color)
    {
        var startRadians = startAngle * Math.PI / 180;
        var endRadians = endAngle * Math.PI / 180;

        //arcPointX/Y is where the arc starts, on the edge of the circle
        var arcPointX = pos.x + Math.cos(startRadians) * radius;
        var arcPointY = pos.y + Math.sin(startRadians) * radius;

        this.context.fillStyle = color;

        this.context.beginPath();
        this.context.moveTo(pos.x, pos.y);
        this.context.lineTo(arcPointX, arcPointY);
        this.context.arc(pos.x, pos.y, radius, startRadians, endRadians);
        this.context.fill();
    };

    canvasRendererProto.lineSector = function (pos, radius, startAngle, endAngle, thickness, color)
    {
        var startRadians = startAngle * Math.PI / 180;
        var endRadians = endAngle * Math.PI / 180;

        //arcPointX/Y is where the arc starts, on the edge of the circle
        var arcPointX = pos.x + Math.cos(startRadians) * radius;
        var arcPointY = pos.y + Math.sin(startRadians) * radius;

        this.context.strokeStyle = color;
        this.context.lineWidth = thickness;

        this.context.beginPath();
        this.context.moveTo(pos.x, pos.y);
        this.context.lineTo(arcPointX, arcPointY);
        this.context.arc(pos.x, pos.y, radius, startRadians, endRadians);
        this.context.closePath();
        this.context.stroke();
    };

    canvasRendererProto.arc = function (pos, radius, startAngle, endAngle, thickness, color)
    {
        var startRadians = startAngle * (Math.PI / 180);
        var endRadians = endAngle * (Math.PI / 180);

        this.context.strokeStyle = color;
        this.context.lineWidth = thickness;

        this.context.beginPath();
        this.context.arc(pos.x, pos.y, radius, startRadians, endRadians, false);
        this.context.stroke();
    };

    canvasRendererProto.fillRect = function (pos, size, color)
    {
        this.context.fillStyle = color;
        this.context.fillRect(pos.x, pos.y, size.x, size.y);
    };

    canvasRendererProto.lineRect = function (pos, size, thickness, color)
    {
        this.context.strokeStyle = color;
        this.context.lineWidth = thickness;
        this.context.strokeRect(pos.x, pos.y, size.x, size.y);
    };

    canvasRendererProto.fillPolygon = function (posArray, color)
    {
        this.context.fillStyle = color;
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

    canvasRendererProto.linePolygon = function (posArray, thickness, color)
    {
        this.context.strokeStyle = color;
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

    canvasRendererProto.fill = function (color)
    {
        this.fillRect({ x: 0, y: 0 }, this.size, color);
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

    canvasRendererProto.text = function (pos, text, font, size, color)
    {
        this.context.font = size + "px " + font;
        this.context.fillStyle = color;
        this.context.fillText(text, pos.x, pos.y);
    };

    canvasRendererProto.getTextWidth = function (text, font, size)
    {
        this.context.font = size + "px " + font;
        return this.context.measureText(text).width;
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

    var frameId = 0;

    BETA.animate = function (callback)
    {
        BETA.assert(frameId === 0, "There is already an animation running!");

        var prevTime;

        frameId = requestAnimationFrame(function animationFn(time)
        {
            frameId = requestAnimationFrame(animationFn);

            var deltaTime = prevTime ?
                (time - prevTime) / 1000
                : 0;

            callback(deltaTime);

            prevTime = time;
        });
    };

    BETA.stopAnimation = function ()
    {
        BETA.assert(frameId > 0, "There is no animation running!");

        cancelAnimationFrame(frameId);
        frameId = 0;
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

    BETA.getMousePos = function (renderer)
    {
        BETA.assert(inputInitiated, "getMousePos(): You haven't initiated the input system yet!");
        var rect = renderer.canvas.getBoundingClientRect();
        return {
            x: Math.round(mousePos.x - rect.left),
            y: Math.round(mousePos.y - rect.top)
        };
    };
}());
