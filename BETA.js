/*
  BETA.js - BEtter Than Advanced.js
  by Erik "CookieShade" Bivrin
  Pre-release build 20/7 - 2015

  Comments in english explain the code,
  comments in swedish are the dev's notes to himself
*/

(function () {
    "use strict";
    window.BETA = {};

    //Gör eventuellt samma omvandling som med vektorerna,
    //dvs. ha inte en konstruktor
    //Testa om man inte behöver köra colorInst.toString i canvas-funktioner
    BETA.Color = function (red, green, blue, alpha) {
        this.r = red;
        this.g = green;
        this.b = blue;
        this.a = (typeof alpha !== "undefined") ? alpha : 1;
    };

    BETA.Color.prototype.toString = function () {
        return (this.a >= 1) ?
          "rgb(" + this.r + "," + this.g + "," + this.b + ")" :
          "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
    };

    //------------VECTOR FUNCTIONS------------\\

    BETA.vector = function (x, y) {
        //Vectors inherit .toString() from vProt
        var v = Object.create(vProt);
        v.x = x;
        v.y = y;
        return v;
    };

    BETA.v = BETA.vector;

    //Makes vectors created from BETA.vector()/v() autoconvert to strings
    //via BETA.vStringify() instead of the default "[object Object]".
    var vProt = {};
    vProt.toString = function () {
        return vStringify(this);
    };

    BETA.vStringify = function (v) {
        return "(" + v.x + ", " + v.y + ")";
    };

    BETA.vAdd = function (v1, v2) {
        return BETA.v(v1.x + v2.x, v1.y + v2.y);
    };

    BETA.vSubtract = function (v1, v2) {
        return BETA.v(v1.x - v2.x, v1.y - v2.y);
    };

    BETA.vScale = function (v1, v2) {
        return BETA.v(v1.x * v2.x, v1.y * v2.y);
    };

    BETA.vDot = function (v1, v2) {
        return v1.x * v2.x + v1.y * v2.y;
    };

    BETA.vScalarMult = function (v, s) {
        return BETA.v(v.x * s, v.y * s);
    };

    BETA.vScalarDiv = function (v, s) {
        return BETA.v(v.x / s, v.y / s);
    };

    BETA.vMagnitude = function (v) {
        return Math.sqrt(v.x * v.x + v.y * v.y);
    };

    BETA.vNormalize = function (v) {
        return (v.x === 0 && v.y === 0) ? v : BETA.vScalarDiv(v, BETA.vMagnitude(v));
    };

    //------------CANVAS INTERFACE------------\\


    //Fixa .context inför release
    BETA.Canvas = function (id) {
        var cvs = document.getElementById(id);
        var ctx = cvs.getContext("2d");

        this.id = id;
        this.canvas = cvs;
        //this.context = ctx;
        this.context = cvs.getContext("2d");
        this.width = cvs.width;
        this.height = cvs.height;
        this.sizeVector = BETA.v(cvs.width, cvs.height);
    };

    BETA.Canvas.prototype.resize = function (x, y) {
        this.width = x;
        this.height = y;
        this.sizeVector = BETA.v(x, y);
        this.canvas.width = x;
        this.canvas.height = y;
        this.canvas.style.width = x + "px";
        this.canvas.style.height = y + "px";
    };

    BETA.Canvas.prototype.vectorResize = function (vector) {
        this.width = vector.x;
        this.height = vector.y;
        this.sizeVector = BETA.v(vector.x, vector.y);
        this.canvas.width = vector.x;
        this.canvas.height = vector.y;
        this.canvas.style.width = vector.x + "px";
        this.canvas.style.height = vector.y + "px";
    };

    BETA.Canvas.prototype.line = function (posA, posB, thickness, style) {
        this.context.strokeStyle = style;
        this.context.lineWidth = thickness;
        this.context.beginPath();
        this.context.moveTo(posA.x, posA.y);
        this.context.lineTo(posB.x, posB.y);
        this.context.stroke();
        this.context.closePath();
    };

    BETA.Canvas.prototype.rect = function (pos, size, style) {
        this.context.fillStyle = style;
        this.context.fillRect(pos.x, pos.y, size.x, size.y);
    };

    BETA.Canvas.prototype.lineRect = function (pos, size, thickness, style) {
        this.context.strokeStyle = style;
        this.context.lineWidth = thickness;
        this.context.strokeRect(pos.x, pos.y, size.x, size.y);
    };

    BETA.Canvas.prototype.translate = function (x, y) {
        this.context.translate(x, y);
    };

    BETA.Canvas.prototype.vectorTranslate = function (vector) {
        this.context.translate(vector.x, vector.y);
    };

    BETA.Canvas.prototype.scale = function (x, y) {
        this.context.scale(x, y);
    };

    BETA.Canvas.prototype.vectorScale = function (vector) {
        this.context.scale(vector.x, vector.y);
    };

    BETA.Canvas.prototype.rotate = function (degrees) {
        this.context.rotate(degrees * Math.PI / 180);
    };

    BETA.Canvas.prototype.rotateRad = function (radians) {
        this.context.rotate(radians);
    };

    BETA.Canvas.prototype.save = function () {
        this.context.save();
    };

    BETA.Canvas.prototype.restore = function () {
        this.context.restore();
    };

})();