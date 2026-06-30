export default class StarField {
    constructor(totalStars = 280) {
        this.time = 0;
        this.stars = [];

        this.createStars(totalStars);
    }

    createStars(totalStars) {
        this.stars = [];

        for (let index = 0; index < totalStars; index++) {
            this.stars.push(this.createStar());
        }
    }

    createStar() {
        const colorProbability = Math.random();

        let color;

        // La mayoría de las estrellas serán blancas.
        if (colorProbability < 0.72) {
            color = [255, 255, 255];
        }
        // Algunas serán azuladas.
        else if (colorProbability < 0.87) {
            color = [145, 195, 255];
        }
        // El resto serán rosas.
        else {
            color = [255, 145, 215];
        }

        const isLargeStar = Math.random() < 0.06;

        return {
            // Usamos posiciones proporcionales para que se adapten
            // al tamaño de cualquier pantalla.
            x: Math.random(),
            y: Math.random(),

            radius: isLargeStar
                ? 1.7 + Math.random() * 1.2
                : 0.35 + Math.random() * 1.25,

            color,

            baseOpacity: 0.35 + Math.random() * 0.65,

            twinkleSpeed: 0.7 + Math.random() * 2,
            twinklePhase: Math.random() * Math.PI * 2,

            // Movimiento muy lento.
            velocityX: (Math.random() - 0.5) * 0.0015,
            velocityY: 0.0005 + Math.random() * 0.0025
        };
    }

    update(deltaTime) {
        this.time += deltaTime;

        for (const star of this.stars) {
            star.x += star.velocityX * deltaTime;
            star.y += star.velocityY * deltaTime;

            // Cuando una estrella sale de la pantalla,
            // vuelve a aparecer por el lado contrario.
            if (star.x < 0) {
                star.x = 1;
            }

            if (star.x > 1) {
                star.x = 0;
            }

            if (star.y > 1) {
                star.y = 0;
                star.x = Math.random();
            }
        }
    }

    draw(context, width, height) {
        for (const star of this.stars) {
            const twinkle =
                0.75 +
                Math.sin(
                    this.time * star.twinkleSpeed +
                    star.twinklePhase
                ) * 0.25;

            const opacity = star.baseOpacity * twinkle;

            const positionX = star.x * width;
            const positionY = star.y * height;

            const [red, green, blue] = star.color;

            context.beginPath();

            context.arc(
                positionX,
                positionY,
                star.radius,
                0,
                Math.PI * 2
            );

            context.fillStyle =
                `rgba(${red}, ${green}, ${blue}, ${opacity})`;

            // Las estrellas más grandes tendrán un pequeño resplandor.
            if (star.radius > 1.4) {
                context.shadowBlur = star.radius * 4;

                context.shadowColor =
                    `rgba(${red}, ${green}, ${blue}, 0.8)`;
            } else {
                context.shadowBlur = 0;
            }

            context.fill();
        }

        // Reiniciamos el resplandor para no afectar
        // los siguientes elementos de la animación.
        context.shadowBlur = 0;
    }
}