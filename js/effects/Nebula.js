export default class Nebula {
    constructor() {
        this.time = 0;

        this.clouds = [
            {
                x: 0.22,
                y: 0.28,
                radiusX: 0.35,
                radiusY: 0.28,
                color: [72, 105, 255],
                opacity: 0.11,
                rotation: -0.35,
                driftX: 0.008,
                driftY: 0.005,
                pulseSpeed: 0.18,
                phase: 0
            },
            {
                x: 0.78,
                y: 0.35,
                radiusX: 0.32,
                radiusY: 0.25,
                color: [255, 80, 183],
                opacity: 0.09,
                rotation: 0.45,
                driftX: -0.006,
                driftY: 0.004,
                pulseSpeed: 0.22,
                phase: 2
            },
            {
                x: 0.48,
                y: 0.78,
                radiusX: 0.42,
                radiusY: 0.25,
                color: [133, 76, 255],
                opacity: 0.08,
                rotation: -0.1,
                driftX: 0.004,
                driftY: -0.006,
                pulseSpeed: 0.15,
                phase: 4
            },
            {
                x: 0.52,
                y: 0.42,
                radiusX: 0.22,
                radiusY: 0.18,
                color: [255, 128, 215],
                opacity: 0.045,
                rotation: 0.2,
                driftX: -0.003,
                driftY: 0.004,
                pulseSpeed: 0.25,
                phase: 1
            }
        ];
    }

    update(deltaTime) {
        this.time += deltaTime;
    }

    draw(context, width, height) {
        context.save();

        // Hace que las luces se mezclen suavemente con el fondo.
        context.globalCompositeOperation = "screen";

        for (const cloud of this.clouds) {
            this.drawCloud(context, width, height, cloud);
        }

        context.restore();
    }

    drawCloud(context, width, height, cloud) {
        const movementX =
            Math.sin(this.time * 0.08 + cloud.phase) *
            width *
            cloud.driftX;

        const movementY =
            Math.cos(this.time * 0.07 + cloud.phase) *
            height *
            cloud.driftY;

        const positionX = cloud.x * width + movementX;
        const positionY = cloud.y * height + movementY;

        const pulse =
            0.85 +
            Math.sin(
                this.time * cloud.pulseSpeed +
                cloud.phase
            ) * 0.15;

        const radiusX =
            cloud.radiusX * width * pulse;

        const radiusY =
            cloud.radiusY * height * pulse;

        const [red, green, blue] = cloud.color;

        context.save();

        context.translate(positionX, positionY);
        context.rotate(cloud.rotation);
        context.scale(radiusX, radiusY);

        const gradient = context.createRadialGradient(
            0,
            0,
            0,
            0,
            0,
            1
        );

        gradient.addColorStop(
            0,
            `rgba(${red}, ${green}, ${blue}, ${cloud.opacity})`
        );

        gradient.addColorStop(
            0.35,
            `rgba(${red}, ${green}, ${blue}, ${cloud.opacity * 0.55})`
        );

        gradient.addColorStop(
            0.7,
            `rgba(${red}, ${green}, ${blue}, ${cloud.opacity * 0.18})`
        );

        gradient.addColorStop(
            1,
            `rgba(${red}, ${green}, ${blue}, 0)`
        );

        context.fillStyle = gradient;
        context.fillRect(-1, -1, 2, 2);

        context.restore();
    }
}