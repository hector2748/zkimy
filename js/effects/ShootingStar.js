export default class ShootingStar {
   constructor(isMobile = false) {
    this.stars = [];
    this.isMobile = isMobile;

    // La primera estrella aparecerá después de unos segundos.
    this.spawnTimer = 4 + Math.random() * 3;
}

    setNextSpawnTime() {
    if (this.isMobile) {
        // En celular: entre 11 y 18 segundos.
        this.spawnTimer = 11 + Math.random() * 7;
    } else {
        // En computadora: entre 7 y 13 segundos.
        this.spawnTimer = 7 + Math.random() * 6;
    }
}

    createStar(width, height) {
        const startsFromTop = Math.random() < 0.7;

        const startX = startsFromTop
            ? Math.random() * width * 0.8
            : -100;

        const startY = startsFromTop
            ? 5
            : Math.random() * height * 0.35;

        const speed =
            450 +
            Math.random() * 250;

        const angle =
            Math.PI / 4 +
            Math.random() * 0.18;

        const colorProbability = Math.random();

        let color;

        if (colorProbability < 0.6) {
            color = [255, 255, 255];
        } else if (colorProbability < 0.82) {
            color = [145, 195, 255];
        } else {
            color = [255, 145, 215];
        }

        this.stars.push({
            x: startX,
            y: startY,

            velocityX: Math.cos(angle) * speed,
            velocityY: Math.sin(angle) * speed,

            length: 180 + Math.random() * 120,
            lineWidth: 2.2 + Math.random() * 1.8,

            opacity: 1,
            fadeSpeed: 0.18 + Math.random() * 0.08,

            color
            
        });
    }
    

    update(deltaTime, width, height) {
        this.spawnTimer -= deltaTime;

       if (
    this.spawnTimer <= 0 &&
    this.stars.length === 0
) {
    this.createStar(width, height);
    this.setNextSpawnTime();
}

        for (const star of this.stars) {
            star.x += star.velocityX * deltaTime;
            star.y += star.velocityY * deltaTime;

            star.opacity -= star.fadeSpeed * deltaTime;
        }

        this.stars = this.stars.filter((star) => {
            return (
                star.x < width + 250 &&
                star.y < height + 250 &&
                star.opacity > 0
            );
        });
    }

    draw(context) {
        context.save();

        context.globalCompositeOperation = "screen";
        context.lineCap = "round";

        for (const star of this.stars) {
            this.drawStar(context, star);
        }

        context.restore();
    }

    drawStar(context, star) {
        const totalSpeed = Math.hypot(
            star.velocityX,
            star.velocityY
        );

        const directionX =
            star.velocityX / totalSpeed;

        const directionY =
            star.velocityY / totalSpeed;

        const tailX =
            star.x -
            directionX * star.length;

        const tailY =
            star.y -
            directionY * star.length;

        const [red, green, blue] = star.color;

        const gradient =
            context.createLinearGradient(
                tailX,
                tailY,
                star.x,
                star.y
            );

        gradient.addColorStop(
            0,
            `rgba(${red}, ${green}, ${blue}, 0)`
        );

        gradient.addColorStop(
            0.7,
            `rgba(
                ${red},
                ${green},
                ${blue},
                ${star.opacity * 0.35}
            )`
        );

        gradient.addColorStop(
            1,
            `rgba(
                ${red},
                ${green},
                ${blue},
                ${star.opacity}
            )`
        );

        context.beginPath();
        context.moveTo(tailX, tailY);
        context.lineTo(star.x, star.y);

        context.strokeStyle = gradient;
        context.lineWidth = star.lineWidth;

        context.shadowBlur = 12;
        context.shadowColor =
            `rgba(
                ${red},
                ${green},
                ${blue},
                ${star.opacity}
            )`;

        context.stroke();

        context.beginPath();

        context.arc(
            star.x,
            star.y,
            star.lineWidth * 1.6,
            0,
            Math.PI * 2
        );

        context.fillStyle =
            `rgba(
                ${red},
                ${green},
                ${blue},
                ${star.opacity}
            )`;

        context.fill();
    }
}