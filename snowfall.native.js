(function () {
    function snowfall(e, options) {
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
                position: opts.flakePosition,
                top: this.y + "px",
                left: this.x + "px",
                fontSize: 0,
                zIndex: opts.flakeIndex,
            });

            if (e.tagName === document.tagName) {
                document.body.appendChild(r);
                e = document.body;
            } else {
                e.appendChild(r);
            }

            this.element = document.getElementById("flake-" + this.id);

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
            };
        }

        function animate() {
            for (let r = 0; r < flakes.length; r++) flakes[r].update();
            c = requestAnimationFrame(animate);
        }

        const defaults = {
            flakeCount: 35,
            flakeColor: "#ffffff",
            flakePosition: "absolute",
            flakeIndex: 999999,
            minSize: 1,
            maxSize: 2,
            minSpeed: 1,
            maxSpeed: 5,
            round: false,
            shadow: false,
            collection: false,
            collectionHeight: 40,
            deviceorientation: false,
        };
        const opts = Object.assign({}, defaults, options);

        function rand(min, max) {
            return Math.round(min + Math.random() * (max - min));
        }

        let flakes = [],
            d = e.clientHeight,
            p = e.clientWidth,
            f = 0,
            c = 0;

        if (e.tagName === document.tagName) f = 25;

        window.addEventListener("resize", () => {
            d = e.clientHeight;
            p = e.clientWidth;
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
            e.querySelectorAll(".snowfall-flakes").forEach((el) => el.remove());
            document.querySelectorAll(".snowfall-canvas").forEach((el) => el.remove());
            flakes = [];
            cancelAnimationFrame(c);
        };
    }

    // експорт як глобальна функція
    window.snowfall = snowfall;
})();
