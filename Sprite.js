/**
 * Author: Alexandre Almeida Ferreira
 * Description: Sprite for javascript canvas
 */

export class Sprite {
    options = {
        spriteId: 0,
        spriteSrc: false,
        context: false,
        pixelSize: 1,
        width: 8,
        height: 8,
        x: 0,
        y: 0,
        lastX: 0,
        lastY: 0,
        assetsFrame: { x: 1, y: 1 },
        animateOptions: {
            steps: 150
        },
    }

    spriteImage = new Image();
    animateTimeOut = null;
    lastAnimProps = {
        lineNumber: 0,
        steps: false,
        nextFrame: 0,
        keyFrame: [0, 1, 2],
        move: { x: 0, y: 0 }
    }

    constructor(props) {
        Object.assign(this.options, props);
        this.spriteImage.src = this.options.spriteSrc;
        this.spriteImage.onload = function () {
            this.spriteLoaded();
        }.bind(this);
    }

    spriteLoaded() {
        return true;
    }

    set position(positionObj) {
        this.options.lastX = this.options.x;
        this.options.lastY = this.options.y;
        this.options.x = positionObj.x
        this.options.y = positionObj.y
    }

    clear() {
        this.options.context.clearRect(
            this.options.lastX,
            this.options.lastY,
            this.options.width * this.options.pixelSize,
            this.options.height * this.options.pixelSize
        );
    }

    draw(imagePosition) {
        this.clear();
        const imgPos = {
            x: 0,
            y: 0
        }
        Object.assign(imgPos, imagePosition);
        this.options.context.drawImage(
            this.spriteImage, //image source
            imgPos.x * this.options.width, //x position
            imgPos.y * this.options.height, //y position
            this.options.width, //cut sprite width
            this.options.height, //cut sprite heigth
            this.options.x, //put start sprite x
            this.options.y, //put start sprite y
            this.options.width * this.options.pixelSize, //stretch
            this.options.height * this.options.pixelSize); //stretch

        this.options.lastX = this.options.x;
        this.options.lastY = this.options.y;
    }

    stopAnimate() {
        clearTimeout(this.animateTimeOut);
    }

    startAnimate(animateOptions) {
        this.stopAnimate();
        const animProps = {
            lineNumber: 0,
            steps: false,
            nextFrame: 0,
            keyFrame: [0, 1, 2],
            move: { x: 0, y: 0 }
        }

        Object.assign(animProps, animateOptions);
        Object.assign(this.lastAnimProps, animProps);

        const frameToShow = animProps.keyFrame[animProps.nextFrame];
        let stepProp = (animProps.steps) ? animProps.steps : this.options.animateOptions.steps;
        let steps = stepProp;
        if (typeof stepProp === 'object') {
            steps = stepProp[animProps.nextFrame];
        }

        animProps.nextFrame = animProps.nextFrame + 1;
        if (animProps.nextFrame >= animProps.keyFrame.length) {
            animProps.nextFrame = 0;
        }
        this.draw({ x: frameToShow, y: animProps.lineNumber });
        this.animateTimeOut = setTimeout(() => {
            //next frame
            this.startAnimate(animProps);
        }, steps);
    }
}