import StarField from "./systems/StarField.js";
import HeartSystem from "./systems/HeartSystem.js";
import HeartFormationSystem from "./systems/HeartFormationSystem.js";

import HeartShape from "./geometry/HeartShape.js";

import Nebula from "./effects/Nebula.js";
import ShootingStar from "./effects/ShootingStar.js";
import PulseEffect from "./effects/PulseEffect.js";
import GlowEffect from "./effects/GlowEffect.js";
import HeartbeatBurst from "./effects/HeartbeatBurst.js";
import TapHeartEffect from "./effects/TapHeartEffect.js";

import TextOverlay from "./ui/TextOverlay.js";
import MusicController from "./ui/MusicController.js";

/* =========================================
   ELEMENTOS DEL HTML
========================================= */

const canvas =
    document.querySelector("#spaceCanvas");

const introScreen =
    document.querySelector("#introScreen");

const startButton =
    document.querySelector("#startButton");

const messageScreen =
    document.querySelector("#messageScreen");

const backgroundMusic =
    document.querySelector("#backgroundMusic");

const musicButton =
    document.querySelector("#musicButton");

const replayButton =
    document.querySelector("#replayButton");

const loadingScreen =
    document.querySelector("#loadingScreen");

/* =========================================
   COMPROBACIONES INICIALES
========================================= */

if (!canvas) {
    throw new Error(
        "No se encontró el elemento #spaceCanvas."
    );
}

if (!introScreen) {
    throw new Error(
        "No se encontró el elemento #introScreen."
    );
}

if (!startButton) {
    throw new Error(
        "No se encontró el elemento #startButton."
    );
}

if (!messageScreen) {
    throw new Error(
        "No se encontró el elemento #messageScreen."
    );
}

const context =
    canvas.getContext("2d");

if (!context) {
    throw new Error(
        "No fue posible crear el contexto 2D."
    );
}

/* =========================================
   DISPOSITIVO Y ACCESIBILIDAD
========================================= */

const initialIsMobile =
    window.innerWidth <= 700;

const initialIsSmallMobile =
    window.innerWidth <= 480;

const prefersReducedMotion =
    window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

/* =========================================
   ESTADO GENERAL
========================================= */

let animationStarted = false;

let previousTime = 0;

let textStarted = false;

let textFallbackTimer = null;

let glowVisibility = 0;

let resizeTimer = null;

/* =========================================
   PARALLAX
========================================= */

let parallaxX = 0;
let parallaxY = 0;

let targetParallaxX = 0;
let targetParallaxY = 0;

const maximumParallax =
    prefersReducedMotion
        ? 0
        : initialIsSmallMobile
            ? 3
            : initialIsMobile
                ? 6
                : 13;

/* =========================================
   CANTIDADES ADAPTABLES
========================================= */

const totalStars =
    prefersReducedMotion
        ? 100
        : initialIsSmallMobile
            ? 130
            : initialIsMobile
                ? 180
                : 320;

const totalFloatingHearts =
    prefersReducedMotion
        ? 6
        : initialIsSmallMobile
            ? 12
            : initialIsMobile
                ? 18
                : 34;

const totalFormationHearts =
    prefersReducedMotion
        ? 160
        : initialIsSmallMobile
            ? 210
            : initialIsMobile
                ? 280
                : 440;

/* =========================================
   SISTEMAS DE LA ESCENA
========================================= */

const nebula =
    new Nebula();

const starField =
    new StarField(
        totalStars
    );

const shootingStar =
    new ShootingStar(
        initialIsMobile
    );

const heartSystem =
    new HeartSystem(
        totalFloatingHearts,
        initialIsMobile
    );

const heartShape =
    new HeartShape();

const heartFormationSystem =
    new HeartFormationSystem(
        initialIsMobile
    );

/* =========================================
   EFECTOS
========================================= */

const pulseEffect =
    new PulseEffect(
        initialIsMobile
    );

/*
 * GlowEffect detecta el tamaño actual
 * de la pantalla dentro de su método draw.
 */
const glowEffect =
    new GlowEffect();

const heartbeatBurst =
    new HeartbeatBurst(
        initialIsMobile
    );

const tapHeartEffect =
    new TapHeartEffect(
        initialIsMobile
    );

/* =========================================
   TEXTO Y MÚSICA
========================================= */

const textOverlay =
    new TextOverlay(
        messageScreen,
        500
    );

const musicController =
    new MusicController(
        backgroundMusic,
        musicButton,
        {
            volume: 0.5,
            fadeDuration: 2500
        }
    );

/* =========================================
   INICIAR EL TEXTO UNA SOLA VEZ
========================================= */

function startTextOnce() {
    if (textStarted) {
        return;
    }

    textStarted = true;

    textOverlay.start();

    console.log(
        "Efecto de escritura iniciado."
    );
}

/* =========================================
   PREPARAR RECURSOS
========================================= */

function waitForAudio(
    audioElement,
    timeout = 3000
) {
    if (
        !audioElement ||
        audioElement.readyState >= 2
    ) {
        return Promise.resolve();
    }

    return new Promise((resolve) => {
        let finished = false;
        let timer = null;

        const finish = () => {
            if (finished) {
                return;
            }

            finished = true;

            if (timer !== null) {
                window.clearTimeout(
                    timer
                );
            }

            audioElement.removeEventListener(
                "loadeddata",
                finish
            );

            audioElement.removeEventListener(
                "canplaythrough",
                finish
            );

            audioElement.removeEventListener(
                "error",
                finish
            );

            resolve();
        };

        timer =
            window.setTimeout(
                finish,
                timeout
            );

        audioElement.addEventListener(
            "loadeddata",
            finish,
            {
                once: true
            }
        );

        audioElement.addEventListener(
            "canplaythrough",
            finish,
            {
                once: true
            }
        );

        audioElement.addEventListener(
            "error",
            finish,
            {
                once: true
            }
        );

        try {
            audioElement.load();
        } catch (error) {
            console.warn(
                "No se pudo preparar el audio:",
                error
            );

            finish();
        }
    });
}

async function prepareExperience() {
    startButton.disabled = true;

    try {
        const fontsReady =
            document.fonts?.ready ??
            Promise.resolve();

        await Promise.all([
            fontsReady,
            waitForAudio(
                backgroundMusic,
                3000
            )
        ]);
    } catch (error) {
        console.warn(
            "Algunos recursos no pudieron cargarse:",
            error
        );
    } finally {
        loadingScreen?.classList.add(
            "is-hidden"
        );

        startButton.disabled = false;

        window.setTimeout(() => {
            loadingScreen?.remove();
        }, 900);

        console.log(
            "Recursos preparados correctamente."
        );
    }
}

/* =========================================
   AJUSTAR CANVAS
========================================= */

function resizeCanvas() {
    const width =
        window.innerWidth;

    const height =
        window.innerHeight;

    const currentIsMobile =
        width <= 700;

    const maximumPixelRatio =
        currentIsMobile
            ? 1.5
            : 2;

    const pixelRatio =
        Math.min(
            window.devicePixelRatio || 1,
            maximumPixelRatio
        );

    canvas.width =
        Math.floor(
            width * pixelRatio
        );

    canvas.height =
        Math.floor(
            height * pixelRatio
        );

    canvas.style.width =
        `${width}px`;

    canvas.style.height =
        `${height}px`;

    context.setTransform(
        pixelRatio,
        0,
        0,
        pixelRatio,
        0,
        0
    );

    const heartTargetPoints =
        heartShape.createPoints(
            totalFormationHearts,
            width,
            height
        );

    heartFormationSystem.setTargets(
        heartTargetPoints,
        width,
        height
    );
}

/*
 * Evita recalcular muchas veces mientras
 * cambia el tamaño de la ventana.
 */
function handleResize() {
    if (resizeTimer !== null) {
        window.clearTimeout(
            resizeTimer
        );
    }

    resizeTimer =
        window.setTimeout(() => {
            resizeCanvas();

            resizeTimer = null;
        }, 120);
}

/* =========================================
   PARALLAX
========================================= */

function updateParallax(
    deltaTime
) {
    const smoothing =
        1 -
        Math.pow(
            0.001,
            deltaTime
        );

    parallaxX +=
        (
            targetParallaxX -
            parallaxX
        ) *
        smoothing;

    parallaxY +=
        (
            targetParallaxY -
            parallaxY
        ) *
        smoothing;
}

function setParallaxTarget(
    clientX,
    clientY
) {
    if (maximumParallax === 0) {
        return;
    }

    const normalizedX =
        (
            clientX /
            window.innerWidth
        ) *
        2 -
        1;

    const normalizedY =
        (
            clientY /
            window.innerHeight
        ) *
        2 -
        1;

    targetParallaxX =
        normalizedX *
        maximumParallax;

    targetParallaxY =
        normalizedY *
        maximumParallax;
}

function resetParallax() {
    targetParallaxX = 0;
    targetParallaxY = 0;
}

/* =========================================
   ANIMACIÓN PRINCIPAL
========================================= */

function animate(
    currentTime
) {
    if (!animationStarted) {
        return;
    }

    /*
     * Reduce el consumo cuando la pestaña
     * está oculta.
     */
    if (document.hidden) {
        previousTime =
            currentTime;

        requestAnimationFrame(
            animate
        );

        return;
    }

    const deltaTime =
        Math.min(
            (
                currentTime -
                previousTime
            ) /
                1000,
            0.033
        );

    previousTime =
        currentTime;

    const width =
        window.innerWidth;

    const height =
        window.innerHeight;

    const currentIsMobile =
        width <= 700;

    context.clearRect(
        0,
        0,
        width,
        height
    );

    /* =====================================
       ACTUALIZAR ESCENA
    ===================================== */

    nebula.update(
        deltaTime
    );

    starField.update(
        deltaTime
    );

    shootingStar.update(
        deltaTime,
        width,
        height
    );

    heartSystem.update(
        deltaTime,
        width,
        height
    );

    heartFormationSystem.update(
        deltaTime
    );

    tapHeartEffect.update(
        deltaTime
    );

    /* =====================================
       FORMACIÓN Y TEXTO
    ===================================== */

    const formationComplete =
        typeof heartFormationSystem
            .isFormationComplete ===
            "function" &&
        heartFormationSystem
            .isFormationComplete();

    if (formationComplete) {
        startTextOnce();
    }

    /* =====================================
       APARICIÓN DEL HALO
    ===================================== */

    const shouldShowGlow =
        formationComplete ||
        textStarted;

    const targetGlowVisibility =
        shouldShowGlow
            ? 1
            : 0;

    const glowTransition =
        1 -
        Math.pow(
            0.01,
            deltaTime
        );

    glowVisibility +=
        (
            targetGlowVisibility -
            glowVisibility
        ) *
        glowTransition;

    /* =====================================
       LATIDO Y PARALLAX
    ===================================== */

    pulseEffect.update(
        deltaTime
    );

    updateParallax(
        deltaTime
    );

    const heartScale =
        pulseEffect.getScale();

    const pulseIntensity =
        pulseEffect.getIntensity();

    if (
        !prefersReducedMotion &&
        formationComplete
    ) {
        heartbeatBurst.update(
            deltaTime,
            pulseIntensity,
            width,
            height
        );
    }

    /* =====================================
       DIBUJAR NEBULOSAS
    ===================================== */

    context.save();

    context.translate(
        parallaxX * 0.18,
        parallaxY * 0.18
    );

    nebula.draw(
        context,
        width,
        height
    );

    context.restore();

    /* =====================================
       DIBUJAR ESTRELLAS
    ===================================== */

    context.save();

    context.translate(
        parallaxX * 0.42,
        parallaxY * 0.42
    );

    starField.draw(
        context,
        width,
        height
    );

    context.restore();

    /* =====================================
       DIBUJAR ESTRELLA FUGAZ
    ===================================== */

    context.save();

    context.translate(
        parallaxX * 0.62,
        parallaxY * 0.62
    );

    shootingStar.draw(
        context
    );

    context.restore();

    /* =====================================
       DIBUJAR CORAZONES AMBIENTALES
    ===================================== */

    context.save();

    context.translate(
        parallaxX,
        parallaxY
    );

    heartSystem.draw(
        context,
        width,
        height
    );

    context.restore();

    /* =====================================
       DIBUJAR HALO
    ===================================== */

    if (glowVisibility > 0.01) {
        glowEffect.draw(
            context,
            width,
            height,
            pulseIntensity,
            heartScale,
            glowVisibility
        );
    }

    /* =====================================
       DIBUJAR CORAZÓN PRINCIPAL
    ===================================== */

    const heartCenterX =
        width / 2;

    const heartCenterY =
        height *
        (
            currentIsMobile
                ? 0.43
                : 0.47
        );

    context.save();

    context.translate(
        heartCenterX,
        heartCenterY
    );

    context.scale(
        heartScale,
        heartScale
    );

    context.translate(
        -heartCenterX,
        -heartCenterY
    );

    heartFormationSystem.draw(
        context
    );

    context.restore();

    /* =====================================
       PARTÍCULAS DEL LATIDO
    ===================================== */

    if (
        !prefersReducedMotion &&
        formationComplete
    ) {
        heartbeatBurst.draw(
            context
        );
    }

    /* =====================================
       CORAZONES GENERADOS AL TOCAR
    ===================================== */

    tapHeartEffect.draw(
        context
    );

    requestAnimationFrame(
        animate
    );
}

/* =========================================
   COMENZAR EXPERIENCIA
========================================= */

function startExperience() {
    if (
        animationStarted ||
        startButton.disabled
    ) {
        return;
    }

    introScreen.classList.add(
        "is-hidden"
    );

    animationStarted = true;

    previousTime =
        performance.now();

    /*
     * Se solicita la música desde el clic
     * para evitar bloqueos del navegador.
     */
    void musicController.start();

    /*
     * Respaldo para mostrar el texto
     * aunque falle la detección de formación.
     */
    textFallbackTimer =
        window.setTimeout(
            startTextOnce,
            11000
        );

    requestAnimationFrame(
        animate
    );

    console.log(
        "Experiencia interactiva iniciada correctamente."
    );
}

/* =========================================
   CREAR CORAZÓN AL TOCAR
========================================= */

function createHeartFromPointer(
    event
) {
    if (!animationStarted) {
        return;
    }

    /*
     * En mouse solo acepta el botón izquierdo.
     */
    if (
        event.pointerType === "mouse" &&
        event.button !== 0
    ) {
        return;
    }

    /*
     * No crea partículas al presionar
     * botones de música o repetición.
     */
    if (
        event.target instanceof Element &&
        event.target.closest("button")
    ) {
        return;
    }

    tapHeartEffect.create(
        event.clientX,
        event.clientY
    );
}

/* =========================================
   EVENTOS
========================================= */

startButton.addEventListener(
    "click",
    startExperience
);

window.addEventListener(
    "resize",
    handleResize
);

window.addEventListener(
    "pointermove",
    (event) => {
        if (!animationStarted) {
            return;
        }

        setParallaxTarget(
            event.clientX,
            event.clientY
        );
    },
    {
        passive: true
    }
);

window.addEventListener(
    "pointerdown",
    createHeartFromPointer,
    {
        passive: true
    }
);

document.addEventListener(
    "mouseleave",
    resetParallax
);

window.addEventListener(
    "blur",
    resetParallax
);

window.addEventListener(
    "pointerup",
    (event) => {
        if (
            event.pointerType ===
            "touch"
        ) {
            resetParallax();
        }
    },
    {
        passive: true
    }
);

document.addEventListener(
    "visibilitychange",
    () => {
        previousTime =
            performance.now();
    }
);

/*
 * Mostrar el botón Volver a ver cuando
 * termine el efecto de escritura.
 */
messageScreen.addEventListener(
    "typing-complete",
    () => {
        if (textFallbackTimer) {
            window.clearTimeout(
                textFallbackTimer
            );

            textFallbackTimer = null;
        }

        replayButton?.classList.add(
            "is-visible"
        );
    }
);

replayButton?.addEventListener(
    "click",
    () => {
        window.location.reload();
    }
);

/* =========================================
   INICIALIZACIÓN
========================================= */

resizeCanvas();

void prepareExperience();