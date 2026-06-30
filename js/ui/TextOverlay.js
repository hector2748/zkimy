class TextOverlay {
    constructor(element, startDelay = 500) {
        this.element = element;
        this.startDelay = startDelay;

        this.hasStarted = false;
        this.hasFinished = false;

        this.title =
            this.element?.querySelector("h2");

        this.description =
            this.element?.querySelector(
                ".message-description"
            );

        this.titleContent =
            this.getOriginalText(
                this.title
            );

        this.descriptionContent =
            this.getOriginalText(
                this.description
            );

        this.clearText();
    }

    getOriginalText(element) {
        if (!element) {
            return "";
        }

        return element.textContent
            .replace(/\s+/g, " ")
            .trim();
    }

    clearText() {
        if (this.title) {
            this.title.textContent = "";
        }

        if (this.description) {
            this.description.textContent = "";
        }
    }

    start() {
        if (
            this.hasStarted ||
            !this.element
        ) {
            return;
        }

        this.hasStarted = true;

        window.setTimeout(() => {
            void this.runTypingSequence();
        }, this.startDelay);
    }

    async runTypingSequence() {
        if (
            !this.element ||
            this.hasFinished
        ) {
            return;
        }

        this.element.classList.add(
            "is-visible"
        );

        /*
         * Comenzamos directamente escribiendo
         * el nombre.
         */
        await this.typeText(
            this.title,
            this.titleContent,
            130
        );

        await this.wait(550);

        await this.typeText(
            this.description,
            this.descriptionContent,
            38
        );

        this.hasFinished = true;

        this.element.classList.add(
            "typing-finished"
        );

        this.element.dispatchEvent(
            new CustomEvent(
                "typing-complete"
            )
        );
    }

    async typeText(
        element,
        text,
        speed
    ) {
        if (!element || !text) {
            return;
        }

        element.textContent = "";

        element.classList.add(
            "typing-active"
        );

        for (
            let index = 0;
            index < text.length;
            index++
        ) {
            element.textContent +=
                text[index];

            await this.wait(speed);
        }

        element.classList.remove(
            "typing-active"
        );
    }

    wait(milliseconds) {
        return new Promise((resolve) => {
            window.setTimeout(
                resolve,
                milliseconds
            );
        });
    }
}

export default TextOverlay;