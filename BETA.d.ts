declare namespace BETA
{
    function assert(assertion: boolean, message: string): void;

    function isNumber(val: any): boolean;

    function mod(x: number, y: number): number;

    function clamp(val: number, a: number, b: number): number;

    function randNum(a: number, b: number): number;

    function randInt(a: number, b: number): number;

    function randElement<T>(arr: T[]): T;

    //------------COLOR FUNCTIONS-----------\\

    class Color
    {
        r: number;
        g: number;
        b: number;
        a: number;
        toString(): string;
    }

    function rgba(red: number, green: number, blue: number, alpha: number): Color;

    function rgb(red: number, green: number, blue: number): Color;

    function hsla(hue: number, saturation: number, lightness: number, alpha: number): Color;

    function hsl(hue: number, saturation: number, lightness: number): Color;

    function hsva(hue: number, saturation: number, value: number, alpha: number): Color;

    function hsv(hue: number, saturation: number, value: number): Color;

    function hwba(hue: number, whiteness: number, blackness: number, alpha: number): Color;

    function hwb(hue: number, whiteness: number, blackness: number): Color;

    //------------VECTOR FUNCTIONS------------\\

    interface Vector
    {
        x: number;
        y: number;
    }

    function vector(x: number, y: number): Vector;

    function v(x: number, y: number): Vector;

    function vCopy(v: Vector): Vector;

    function vStringify(v: Vector): string;

    function vEquals(v1: Vector, v2: Vector): boolean;

    function vAdd(v1: Vector, v2: Vector): Vector;

    function vSubtract(v1: Vector, v2: Vector): Vector;

    function vScale(v1: Vector, v2: Vector): Vector;

    function vDot(v1: Vector, v2: Vector): Vector;

    function vScalarMult(v: Vector, s: number): Vector;

    function vScalarDiv(v: Vector, s: number): Vector;

    function vMagnitude(v: Vector): number;

    function vNormalize(v: Vector): Vector;

    function vAngle(vec: Vector): number;

    function vFromPolar(radius: number, angle: number): Vector;

    function vDistance(v1: Vector, v2: Vector): number;

    function vGridDist(v1: Vector, v2: Vector): number;

    function vRotate(vec: Vector, pivot: Vector, angle: number): Vector;

    //------------IMAGE FUNCTIONS-------------\\

    function loadImage(url: string): HTMLImageElement;

    function waitForImgLoad(callback: () => any): void;

    //------------CANVAS INTERFACE------------\\

    type CanvasStyle = Color | string | CanvasGradient | CanvasPattern;

    class CanvasRenderer
    {
        id: string;
        canvas: HTMLCanvasElement;
        context: CanvasRenderingContext2D;
        width: number;
        height: number;
        size: Vector;

        //Configuration
        resize(x: number, y: number): void;
        resizeByVector(vector: Vector): void;
        resizeToMax(): void;

        translate(x: number, y: number): void;
        translateByVector(vector: Vector): void;

        scale(x: number, y: number): void;
        scaleByVector(vector: Vector): void;

        rotate(degrees: number): void;
        rotateRad(radians: number): void;

        save(): void;
        restore(): void;

        //Rendering
        line(posA: Vector, posB: Vector, thickness: number, color: CanvasStyle): void;

        fillCircle(pos: Vector, radius: number, color: CanvasStyle): void;
        lineCircle(pos: Vector, radius: number, thickness: number, color: CanvasStyle): void;

        fillSector(pos: Vector, radius: number, startAngle: number, endAngle: number, color: CanvasStyle): void;
        lineSector(pos: Vector, radius: number, startAngle: number, endAngle: number, thickness: number, color: CanvasStyle): void;
        arc(pos: Vector, radius: number, startAngle: number, endAngle: number, thickness: number, color: CanvasStyle): void;

        fillRect(pos: Vector, size: Vector, color: CanvasStyle): void;
        lineRect(pos: Vector, size: Vector, thickness: number, color: CanvasStyle): void;

        fillPolygon(posArray: Vector[], color: CanvasStyle): void;
        linePolygon(posArray: Vector[], thickness: number, color: CanvasStyle): void;

        clear(): void;
        clearRect(pos: Vector, size: Vector): void;
        fill(color: CanvasStyle): void;

        drawImage(img: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement, pos: Vector, size?: Vector): void;

        text(pos: Vector, text: string, font: string, size: number, color: CanvasStyle): void;
    }

    function getRenderer(id: string): CanvasRenderer;

    //------------ANIMATION SYSTEM------------\\

    function animate(callback: (deltaTime: number) => any): void;

    function stopAnimation(): void;

    //-------------INPUT HANDLING-------------\\

    function initInput(): void;

    function isButtonDown(button: string): boolean;

    type ButtonEventHandler = (event: MouseEvent | KeyboardEvent) => any;

    function onButtonDown(button: string, callback: ButtonEventHandler): void;

    function onButtonUp(button: string, callback: ButtonEventHandler): void;

    function getMousePos(renderer: CanvasRenderer): Vector;
}
