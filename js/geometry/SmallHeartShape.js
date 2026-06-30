class SmallHeartShape {
    constructor() {
        this.path = new Path2D();

        this.path.moveTo(0, -10);

        this.path.bezierCurveTo(
            -18,
            -28,
            -38,
            -8,
            -26,
            12
        );

        this.path.bezierCurveTo(
            -18,
            24,
            -6,
            32,
            0,
            38
        );

        this.path.bezierCurveTo(
            6,
            32,
            18,
            24,
            26,
            12
        );

        this.path.bezierCurveTo(
            38,
            -8,
            18,
            -28,
            0,
            -10
        );

        this.path.closePath();
    }

    draw(
        context,
        {
            x,
            y,
            size,
            color,
            opacity = 1,
            rotation = 0,
            glow = 0
        }
    ) {
        context.save();

        context.translate(x, y);
        context.rotate(rotation);

        const scale = size / 76;

        context.scale(scale, scale);

        context.globalAlpha = opacity;
        context.fillStyle = color;

        if (glow > 0) {
            context.shadowBlur = glow;
            context.shadowColor = color;
        }

        context.fill(this.path);

        context.restore();
    }
}

export default SmallHeartShape;