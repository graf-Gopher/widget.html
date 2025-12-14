(function () {
    function snowfall(options) {
        // створюємо контейнер для снігу
        let container = document.getElementById("snowfall-container");
        if (!container) {
            container = document.createElement("div");
            container.id = "snowfall-container";
            Object.assign(container.style, {
                position: "fixed",
                top: "0",
                left: "0",
                width: "100vw",
                height: "100vh",
                pointerEvents: "none", // щоб не блокував кліки
                overflow: "hidden",
                zIndex: 999999,
            });
            document.body.appendChild(container);
        }

        function Snowflake(x, y, size, speed, id) {
            this.id = id;
            this.x = x;
            this.y = y;
            this.size = size;
            this.speed = speed;
            this.step = 0;
            this.stepSize = rand(1, 10) / 100;

            let r;
            if (opts.image) {
                r = document.createElement("img");
                r.src = opts.image;
            } else {
                r = document.createElement("div");
                r.style.background = opts.flakeColor;
            }
            r.className = "snowfall-flakes";
            r.id = "flake-" + this.id;
            Object.assign(r.style, {
                width: this.size + "px",
                height: this.size + "px",
                position: "absolute",
                top: this.y + "px",
                left: this.x + "px",
                fontSize: 0,
            });

            container.appendChild(r);
            this.element = r;

            this.update = () => {
                this.y += this.speed;
                if (this.y > d - (this.size + 6)) this.reset();
                this.element.style.top = this.y + "px";
                this.element.style.left = this.x + "px";
                this.step += this.stepSize;
                this.x += S === false ? Math.cos(this.step) : S + Math.cos(this.step);

                if (this.x > p - f || this.x < f) this.reset();
            };

            this.reset = () => {
                this.y = 0;
                this.x = rand(f, p - f);
                this.stepSize = rand(1, 10) / 100;
                this.size = rand(100 * opts.minSize, 100 * opts.maxSize) / 100;
                this.speed = rand(opts.minSpeed, opts.maxSpeed);
                this.element.style.width = this.size + "px";
                this.element.style.height = this.size + "px";
            };
        }

        function animate() {
            for (let r = 0; r < flakes.length; r++) flakes[r].update();
            c = requestAnimationFrame(animate);
        }

        const defaults = {
            flakeCount: 35,
            flakeColor: "#ffffff",
            minSize: 1,
            maxSize: 2,
            minSpeed: 1,
            maxSpeed: 5,
            round: false,
            shadow: false,
            image: null,
            deviceorientation: false,
        };
        const opts = Object.assign({}, defaults, options);

        function rand(min, max) {
            return Math.round(min + Math.random() * (max - min));
        }

        let flakes = [],
            d = container.clientHeight,
            p = container.clientWidth,
            f = 0,
            c = 0;

        window.addEventListener("resize", () => {
            d = container.clientHeight;
            p = container.clientWidth;
        });

        for (let r = 0; r < opts.flakeCount; r++) {
            flakes.push(new Snowflake(rand(f, p - f), rand(0, d), rand(100 * opts.minSize, 100 * opts.maxSize) / 100, rand(opts.minSpeed, opts.maxSpeed), r));
        }

        if (opts.round) {
            document.querySelectorAll(".snowfall-flakes").forEach((el) => {
                el.style.borderRadius = opts.maxSize + "px";
            });
        }
        if (opts.shadow) {
            document.querySelectorAll(".snowfall-flakes").forEach((el) => {
                el.style.boxShadow = "1px 1px 1px #555";
            });
        }

        let S = false;
        if (opts.deviceorientation) {
            window.addEventListener("deviceorientation", (ev) => {
                S = 0.1 * ev.gamma;
            });
        }

        animate();

        this.clear = () => {
            container.querySelectorAll(".snowfall-flakes").forEach((el) => el.remove());
            flakes = [];
            cancelAnimationFrame(c);
        };
    }

    // експорт як глобальна функція
    window.snowfall = snowfall;
})();
