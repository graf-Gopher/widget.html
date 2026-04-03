function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// const CHERRY_API_BASE = window.CHERRY_API_BASE || "https://mlnd.order.home.under-tree-e.com";
const CHERRY_API_BASE = window.CHERRY_API_BASE || "https://cherry-mail.applic.com.ua";
const CHERRY_CLICK_ENDPOINT = `${CHERRY_API_BASE}/click-item`;
const CHERRY_USER_ENDPOINT = `${CHERRY_API_BASE}/user-clicks`;
const CHERRY_MAIL_ENDPOINT = window.CHERRY_MAIL_ENDPOINT || `${CHERRY_API_BASE}/send-email`;
const CHERRY_CAPTCHA_ENABLED = false;
const CHERRY_CAMPAIGN_START = new Date(2026, 3, 1, 0, 0, 0, 0);
const CHERRY_CAMPAIGN_END = new Date(2026, 3, 10, 0, 0, 0, 0);
const CHERRY_DAILY_LIMITS = {
    // You can also override the limit during a day:
    // "2026-04-01 12:00": 15,
    "2026-04-01": 15,
    "2026-04-02": 20,
    "2026-04-03": 30,
    "2026-04-04 07:00": 35,
    "2026-04-05 07:00": 42,
    "2026-04-06 07:00": 47,
    "2026-04-07 07:00": 62,
    "2026-04-08 07:00": 67,
    "2026-04-09 07:00": 70,
};

function injectCherryAlertStyles() {
    if (document.getElementById("cherry-alert-styles")) return;

    const style = document.createElement("style");
    style.id = "cherry-alert-styles";
    style.textContent = `
        .cherry_block {
            position: fixed;
            bottom: 20px;
            left: 20px;
            background-color: white;
            padding: 10px 16px;
            border-radius: 16px;
            z-index: 9999;
            display: flex;
            gap: 16px;
            align-items: center;
            border: 2px solid #cf125e;
            cursor: pointer;
            transition: all 0.2s ease-in-out;
        }

        .cherry_block:hover {
            transform: scale(1.1);
        }

        .cherry_block #cherry-icon {
            font-size: 34px;
        }

        .cherry_block #cherry-counter {
            font-size: 24px;
            font-weight: bold;
            font-family: sans-serif;
        }

        .cherry_block #cherry-timer {
            display: block;
            font-size: 12px;
            line-height: 1.3;
            color: #cf125e;
            font-family: sans-serif;
            white-space: nowrap;
        }

        .cherry_block #send-btn {
            background: none;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
            font-family: sans-serif;
            font-size: 16px;
            color: #cf125e;
        }

        .custom-alert {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.4);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 99999;
        }

        .custom-alert-content {
            background: #fff;
            border: 2px solid #cf125e;
            border-radius: 16px;
            padding: 24px 32px;
            text-align: center;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            max-width: 90vw;
        }

        .captcha {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
        }

        .captcha-inner {
            display: flex;
            gap: 0.5rem;
            align-items: center;
            justify-content: center;
        }

        #captcha-image {
            width: 100px;
            height: 40px;
            font-size: 24px;
            font-style: italic;
            text-decoration: line-through;
            border: 2px solid #cf125e;
            border-radius: 8px;
            background-color: #ffe4f0;
            color: #cf125e;
            display: flex;
            align-items: center;
            justify-content: center;
            user-select: none;
        }

        #captcha-input {
            padding: 10px 14px;
            border: 2px solid #cf125e;
            border-radius: 8px;
            font-size: 16px;
            width: 140px;
        }

        #captcha-submit {
            margin-top: 12px;
            padding: 10px 20px;
            background-color: #cf125e;
            color: white;
            border: none;
            border-radius: 12px;
            font-size: 16px;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }

        #captcha-submit:hover {
            background-color: #e83e7b;
        }

        #captcha-status {
            font-size: 14px;
            color: #cf125e;
            margin-top: 4px;
        }

        #refresh-captcha {
            cursor: pointer;
            font-size: 20px;
            color: #cf125e;
            transition: transform 0.3s ease;
        }

        #refresh-captcha:hover {
            transform: rotate(90deg);
        }

        #custom-alert-text {
            font-size: 18px;
            font-weight: bold;
            color: #cf125e;
            margin-bottom: 12px;
        }

        #custom-alert-close {
            padding: 10px 20px;
            background-color: #cf125e;
            color: white;
            border: none;
            border-radius: 12px;
            font-size: 16px;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }

        #custom-alert-close:hover {
            background-color: #e83e7b;
        }
    `;

    document.head.appendChild(style);
}

function injectCherryAlertMarkup() {
    if (document.getElementById("custom-alert")) return;

    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
        <div id="custom-alert" class="custom-alert">
            <div class="custom-alert-content">
                <div id="captcha-block" class="captcha">
                    <div class="captcha-inner">
                        <div id="user-input" class="inline">
                            <input type="text" id="captcha-input" placeholder="Captcha code" />
                        </div>
                        <div class="inline" id="refresh-captcha" aria-label="Refresh captcha" title="Refresh captcha">&#8635;</div>
                    </div>
                    <div id="captcha-image" class="inline"></div>
                    <button id="captcha-submit">Перевірити</button>
                    <p id="captcha-status"></p>
                </div>

                <div id="success-block" style="display: none">
                    <p id="custom-alert-text">Вітаю! 🎉 Твої результати зараховано.</p>
                    <button id="custom-alert-close">OK</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(wrapper.firstElementChild);
}

function showCustomAlert(message) {
    const alertBox = document.getElementById("custom-alert");
    const alertText = document.getElementById("custom-alert-text");
    alertText.textContent = message;
    alertBox.style.display = "flex";

    document.getElementById("custom-alert-close").onclick = () => {
        alertBox.style.display = "none";
    };
}

function showSuccessAlert(message) {
    const alertBox = document.getElementById("custom-alert");
    document.getElementById("captcha-block").style.display = "none";
    document.getElementById("success-block").style.display = "block";
    document.getElementById("custom-alert-text").textContent = message;
    alertBox.style.display = "flex";
}

document.addEventListener("DOMContentLoaded", function () {
    (async function () {
        let sendblock = false;
        let countdownInterval = null;
        const renderedCherries = [];

        injectCherryAlertStyles();
        injectCherryAlertMarkup();

        const userId = window.GLOBAL?.USER_ID;
        // const userId = "4990";

        if (!userId) {
            console.error("Cherry widget requires userId");
            return;
        }

        let cherriesFounds = [];
        let cherriesFound = 0;
        let currentLimit = 0;

        function formatCampaignDateKey(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
        }

        function parseCampaignLimitKey(key) {
            const match = /^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?$/.exec(key);

            if (!match) {
                return null;
            }

            const [, year, month, day, hours = "00", minutes = "00", seconds = "00"] = match;
            const date = new Date(Number(year), Number(month) - 1, Number(day), Number(hours), Number(minutes), Number(seconds), 0);

            if (date.getFullYear() !== Number(year) || date.getMonth() !== Number(month) - 1 || date.getDate() !== Number(day)) {
                return null;
            }

            return {
                dateKey: `${year}-${month}-${day}`,
                timestamp: date.getTime(),
            };
        }

        function getCampaignLimit(date) {
            const currentDateKey = formatCampaignDateKey(date);
            const currentTimestamp = date.getTime();
            let matchedLimit = 0;
            let matchedTimestamp = -Infinity;

            Object.entries(CHERRY_DAILY_LIMITS).forEach(([key, limit]) => {
                const parsedKey = parseCampaignLimitKey(key);

                if (!parsedKey || parsedKey.dateKey !== currentDateKey || parsedKey.timestamp > currentTimestamp) {
                    return;
                }

                if (parsedKey.timestamp >= matchedTimestamp) {
                    matchedTimestamp = parsedKey.timestamp;
                    matchedLimit = Number(limit) || 0;
                }
            });

            return matchedLimit;
        }

        function isCampaignActive(date) {
            return date >= CHERRY_CAMPAIGN_START && date < CHERRY_CAMPAIGN_END;
        }

        function formatTimeLeft(ms) {
            const totalSeconds = Math.max(0, Math.floor(ms / 1000));
            const days = Math.floor(totalSeconds / 86400);
            const hours = Math.floor((totalSeconds % 86400) / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;
            return `${String(days).padStart(2, "0")}d ${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;
        }

        function removeRenderedCherries() {
            renderedCherries.forEach((cherry) => cherry.remove());
            renderedCherries.length = 0;
        }

        function updateCounter() {
            const counter = document.getElementById("cherry-counter");
            if (counter) {
                // counter.textContent = `${cherriesFound}/${currentLimit}`;
                counter.textContent = `${cherriesFound}/70`;
            }
        }

        function updateTimer() {
            const timer = document.getElementById("cherry-timer");
            const panel = document.getElementById("send-cherry");
            const now = new Date();

            if (!timer) {
                return;
            }

            if (!isCampaignActive(now)) {
                timer.textContent = "Campaign ended";
                removeRenderedCherries();
                if (panel) {
                    panel.style.display = "none";
                }
                if (countdownInterval) {
                    clearInterval(countdownInterval);
                    countdownInterval = null;
                }
                return;
            }

            currentLimit = getCampaignLimit(now);
            updateCounter();
            timer.textContent = `Time left: ${formatTimeLeft(CHERRY_CAMPAIGN_END.getTime() - now.getTime())}`;

            if (cherriesFound >= currentLimit) {
                removeRenderedCherries();
            }
        }

        function extractClickedItemIds(clickedItems) {
            if (!Array.isArray(clickedItems)) {
                return [];
            }

            return clickedItems
                .map((item) => {
                    if (typeof item === "number") {
                        return item;
                    }

                    return Number(item?.itemId);
                })
                .filter((itemId) => Number.isFinite(itemId));
        }

        async function loadUserClicks() {
            const response = await fetch(`${CHERRY_USER_ENDPOINT}?userId=${encodeURIComponent(userId)}`);

            if (!response.ok) {
                let message = "Failed to load user cherry state";

                try {
                    const errorData = await response.json();
                    if (errorData?.error) {
                        message = errorData.error;
                    }
                } catch {
                    // Ignore JSON parse failure and use default message.
                }

                throw new Error(message);
            }

            const data = await response.json();
            cherriesFounds = extractClickedItemIds(data.user?.clickedItems);
            cherriesFound = cherriesFounds.length;
        }

        async function saveClickedCherry(itemId) {
            const response = await fetch(CHERRY_CLICK_ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId,
                    itemId,
                    page: window.location.href,
                }),
            });

            if (!response.ok) {
                let message = "Failed to save clicked cherry";

                try {
                    const errorData = await response.json();
                    if (errorData?.error) {
                        message = errorData.error;
                    }
                } catch {
                    // Ignore JSON parse failure and use default message.
                }

                throw new Error(message);
            }

            const data = await response.json();
            cherriesFounds = extractClickedItemIds(data.user?.clickedItems);
            cherriesFound = cherriesFounds.length;
        }

        try {
            await loadUserClicks();
        } catch (error) {
            console.error("Cherry state load failed:", error.message);
            return;
        }

        async function sendCherryResult() {
            const payload = {
                userId,
                subject: `Cherry result: ${userId}`,
                text: [
                    `User ID: ${userId}`,
                    `Found cherries: ${cherriesFound}`,
                    `---`,
                    `Found IDs: ${cherriesFounds.join(", ") || "none"}`,
                    `Page: ${window.location.href}`,
                    `Sent at: ${new Date().toISOString()}`,
                ].join("\n"),
            };

            const response = await fetch(CHERRY_MAIL_ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                let message = "Failed to send cherry result";

                try {
                    const errorData = await response.json();
                    if (errorData?.error) {
                        message = errorData.error;
                    }
                } catch {
                    // Ignore JSON parse failure and use default message.
                }

                throw new Error(message);
            }

            return response.json();
        }

        const now = new Date();

        if (!isCampaignActive(now)) {
            return;
        }

        currentLimit = getCampaignLimit(now);

        // const config = await fetch("https://marylash.pro/cherries.json").then((r) => r.json());
        const config = cherries;
        const currentPage = window.location.pathname;
        let pageConfig = null;
        console.log(currentPage);

        if (currentPage === "/" || currentPage === "/uk/") {
            pageConfig = config.find((p) => p.page === "/");
        } else {
            pageConfig = config.reduce((best, p) => {
                if (currentPage.includes(p.page)) {
                    if (!best || p.page.length > best.page.length) {
                        return p;
                    }
                }
                return best;
            }, null);
            if (pageConfig.page === "/") {
                pageConfig = null;
            }
        }

        console.log(pageConfig);

        const panel = document.createElement("div");
        panel.classList.add("cherry_block");
        panel.id = "send-cherry";
        panel.innerHTML = `
            <span id="cherry-icon">
                <img src="https://i.postimg.cc/m25smqQj/image.png" alt="cherries" width="40px" height="40px" />
            </span>
            <span>
                <!--<span id="cherry-counter">${cherriesFound}/${currentLimit}</span>-->
                <span id="cherry-counter">${cherriesFound}/70</span>
                <!--<span id="cherry-timer"></span>-->
            </span>
            <button id="send-btn">
            <!--<svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 0 24 24" width="40px" fill="#cf125e"><path d="M0 0h24v24H0z" fill="none"/><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>-->
            Зберегти
            </button>
        `;
        document.body.appendChild(panel);
        updateTimer();
        countdownInterval = setInterval(updateTimer, 1000);

        if (pageConfig && cherriesFound < currentLimit) {
            pageConfig.cherries.forEach((cherryConfig) => {
                if (pageConfig.page.includes("checkout")) {
                    const date = new Date();
                    if (cherryConfig.x === 15 && date.getDate() !== 15) {
                        return;
                    } else if (cherryConfig.x === 24 && date.getDate() !== 24) {
                        return;
                    }
                }

                if (cherriesFounds.some((id) => id === cherryConfig.id)) {
                    return;
                }
                let container = cherryConfig.block ? document.querySelector(cherryConfig.block) : null;
                // console.log(container);

                const cherry = document.createElement("div");
                cherry.classList.add("cherry");

                // cherry.textContent = "🍒";
                const cherryImage = document.createElement("img");
                cherryImage.src = "https://i.postimg.cc/m25smqQj/image.png";
                cherryImage.alt = "cherries";
                cherryImage.width = 60;
                cherryImage.height = 60;
                cherry.appendChild(cherryImage);

                cherry.style.position = "absolute";
                cherry.style.cursor = "pointer";
                cherry.style.fontSize = "40px";
                cherry.style.zIndex = "9999";

                cherry.addEventListener("click", async () => {
                    cherry.style.pointerEvents = "none";

                    try {
                        await saveClickedCherry(cherryConfig.id);
                        updateCounter();
                        cherry.remove();
                        const cherryIndex = renderedCherries.indexOf(cherry);
                        if (cherryIndex !== -1) {
                            renderedCherries.splice(cherryIndex, 1);
                        }

                        if (cherriesFound >= currentLimit) {
                            removeRenderedCherries();
                        }
                    } catch (error) {
                        cherry.style.pointerEvents = "auto";
                        console.error("Cherry save failed:", error.message);
                    }
                });

                if (container) {
                    if (getComputedStyle(container).position === "static") {
                        container.style.position = "relative";
                    }
                    cherry.style.left = typeof cherryConfig.x === "number" ? cherryConfig.x + "px" : cherryConfig.x;
                    cherry.style.top = typeof cherryConfig.y === "number" ? cherryConfig.y + "px" : cherryConfig.y;
                    container.appendChild(cherry);
                    renderedCherries.push(cherry);
                } else {
                    const maxWidth = document.documentElement.scrollWidth;
                    const maxHeight = document.documentElement.scrollHeight;

                    cherry.style.left = Math.floor(Math.random() * maxWidth) + "px";
                    cherry.style.top = Math.floor(Math.random() * maxHeight) + "px";

                    // cherry.style.left = Math.floor(Math.random() * window.innerWidth) + "px";
                    // cherry.style.top = Math.floor(Math.random() * window.innerHeight) + "px";
                    document.body.appendChild(cherry);
                    renderedCherries.push(cherry);
                }
            });
        }

        document.getElementById("send-cherry").addEventListener("click", async () => {
            if (sendblock) return;
            sendblock = true;

            if (!CHERRY_CAPTCHA_ENABLED) {
                try {
                    await sendCherryResult();
                    showSuccessAlert("Вітаю! 🎉 Твої результати зараховано.");
                    console.log("Cherry send complete");
                } catch (error) {
                    console.error("Cherry send failed:", error.message);
                } finally {
                    sendblock = false;
                }

                return;
            }

            const res = showCustomAlert("Вітаю! 🎉Твої результати зараховано.");
            console.log(res);
            console.log("Cherry send wait");
            return;
        });

        if (CHERRY_CAPTCHA_ENABLED) {
            document.getElementById("refresh-captcha").addEventListener("click", generateCaptcha);
            document.getElementById("captcha-submit").addEventListener("click", verifyCaptcha);
        }
        document.getElementById("custom-alert-close").addEventListener("click", () => {
            document.getElementById("custom-alert").style.display = "none";
        });

        let captchaCode = "";

        function generateCaptcha() {
            const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            captchaCode = "";
            for (let i = 0; i < 5; i++) {
                captchaCode += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            document.getElementById("captcha-image").textContent = captchaCode;
            document.getElementById("captcha-input").value = "";
            document.getElementById("captcha-status").textContent = "";
        }

        function showCustomAlert() {
            const alertBox = document.getElementById("custom-alert");
            alertBox.style.display = "flex";
            document.getElementById("captcha-block").style.display = "flex";
            document.getElementById("success-block").style.display = "none";
            generateCaptcha();
        }

        async function verifyCaptcha() {
            const input = document.getElementById("captcha-input").value;
            if (input === captchaCode) {
                // успіх
                document.getElementById("captcha-block").style.display = "none";
                document.getElementById("success-block").style.display = "block";
                try {
                    await sendCherryResult();
                    sendblock = false;
                    console.log("Cherry send complete");
                    return true;
                } catch (error) {
                    document.getElementById("success-block").style.display = "none";
                    document.getElementById("captcha-block").style.display = "flex";
                    document.getElementById("captcha-status").textContent = `❌ Помилка відправки: ${error.message}`;
                    sendblock = false;
                    return false;
                }
            } else {
                document.getElementById("captcha-status").textContent = "❌ Не співпало, спробуй ще раз";
                generateCaptcha();
                return false;
            }
        }
    })();
});

var cherries = [
    {
        page: "/product-category/lamymejker-ru/instrumenty-ru-ru/applikatory/",
        cherries: [
            {
                id: 1,
                block: ".catalog__content .catalog__text",
                x: "50%",
                y: -50,
            },
        ],
    },
    {
        page: "/blog/",
        cherries: [
            {
                id: 2,
                block: ".page-content .entries-i:nth-of-type(5)",
                x: -10,
                y: "70%",
            },
        ],
    },
    {
        page: "/marylash-boks-podstavka-skoshennyj-s-5-planshetami/",
        cherries: [
            {
                id: 3,
                block: ".product-price__item",
                x: "120%",
                y: -10,
            },
        ],
    },
    {
        page: "/brendy/",
        cherries: [
            {
                id: 4,
                block: "div.container main#main.main div.wrapper div.catalog div.catalog__middle div.catalog__middle-col.catalog__middle-col--content div.catalog__content div.pagination-container",
                x: "50%",
                y: "100%",
            },
        ],
    },
    {
        page: "/product-category/brovyst-ru/",
        cherries: [
            {
                id: 5,
                block: ".container .catalog .catalog__text .seo-text .text h2:nth-of-type(2)",
                x: "50%",
                y: -50,
            },
        ],
    },
    {
        page: "/product-category/brovyst-ru/kraski/",
        cherries: [
            {
                id: 6,
                block: "div.container main#main.main div.wrapper div.catalog div.catalog__middle.j-catalog-sticker-parent div.catalog__middle-col.catalog__middle-col--content.catalog__middle-col--shifted-right div.catalog__content div.children-pages-menu nav.children-pages-menu__content",
                x: "10%",
                y: -50,
            },
        ],
    },
    {
        page: "/vaksinh/",
        cherries: [
            {
                id: 7,
                block: "div.container main#main.main div.wrapper div.catalog div.catalog__middle.j-catalog-sticker-parent div.catalog__middle-col.catalog__middle-col--content.catalog__middle-col--shifted-right div.catalog__content div.children-pages-menu nav.children-pages-menu__content",
                x: "10%",
                y: -50,
            },
        ],
    },
    {
        page: "/product-category/rashodnye-materialy/",
        cherries: [
            {
                id: 8,
                block: "div.container main#main.main div.wrapper div.catalog div.catalog__middle.j-catalog-sticker-parent div.catalog__middle-col.catalog__middle-col--content.catalog__middle-col--shifted-right div.catalog__content .catalogGrid.catalog-grid.catalog-grid--m.catalog-grid--sidebar li.catalog-grid__item:nth-of-type(10)",
                x: -50,
                y: "50%",
            },
        ],
    },
    {
        page: "/nabor-raskhodnykh-materyalov-blue/",
        cherries: [
            {
                id: 9,
                block: ".product-title",
                x: "50%",
                y: 50,
            },
        ],
    },
    {
        page: "/store-reviews/",
        cherries: [
            {
                id: 10,
                block: ".p-review__body:nth-of-type(5)",
                x: "90%",
                y: 50,
            },
        ],
    },
    {
        page: "/vii-black-volume-lashes-007-b-mix-4-7/",
        cherries: [
            {
                id: 11,
                block: ".product-price__item",
                x: "120%",
                y: -10,
            },
        ],
    },
    {
        page: "/resnytsy-blond-honey-brown-volume-lashes-007-b-mix-4-7/",
        cherries: [
            {
                id: 12,
                block: "div.container main#main.main div.wrapper section.product div.product__grid div.product__column.product__column--left div.product__column-container.j-product-left-column div.product__column-item div.product__group.product__group--tabs div.j-product-block__tab div.product__section .product-description > div:nth-of-type(1) > h2:nth-of-type(2)",
                x: "50%",
                y: 0,
            },
        ],
    },
    {
        page: "/sale/",
        cherries: [
            {
                id: 13,
                block: ".pagination-container",
                x: "50%",
                y: -50,
            },
        ],
    },
    {
        page: "/product-category/leshmejker-ru/preparaty-dlya-narashhivaniya-i-snyatiya/remuvery-ru-ru-preparaty-dlya-narashhivaniya-i-snyatiya/",
        cherries: [
            {
                id: 14,
                block: "hdiv.container main#main.main div.wrapper div.catalog div.catalog__middle.j-catalog-sticker-parent div.catalog__middle-col.catalog__middle-col--content.catalog__middle-col--shifted-right div.catalog__content .catalogGrid.catalog-grid.catalog-grid--m.catalog-grid--sidebar li.catalog-grid__item:nth-of-type(6)",
                x: "50%",
                y: -50,
            },
        ],
    },
    {
        page: "/product/elektronnyj-termometr-gigrometr-dlya-narashhivaniya-resnicz-htc-1/",
        cherries: [
            {
                id: 15,
                block: ".product-title",
                x: "90%",
                y: 50,
            },
        ],
    },
    {
        page: "/",
        cherries: [
            {
                id: 16,
                block: "div.container main#main.main section.frontInfo div.frontInfo-section.__1 div.layout-wrap div.frontInfo-container.__1.__single section.frontInfo-about article.frontInfo-content .frontInfo-text h2:nth-of-type(2)",
                x: "10%",
                y: 0,
            },
            {
                id: 17,
                block: "div.container main#main.main div.banners-group section.banners.banners--wideblock.banners--gaps-m div.banners__container div.banners__slider.swiper-container-fade.swiper-container-initialized.swiper-container-horizontal.swiper-container-pointer-events div.banners__slider-wrapper div.banners__slider-i:nth-of-type(10) div.banners__item.banners__item--radius-none.banners__item--size-l div.banner div.banner-image",
                x: "50%",
                y: -50,
            },
            {
                id: 18,
                block: "div.container footer.footer div.footer__container div.footer__wrapper.wrapper div.footer__columns div.footer__col div.footer__col-wrap div.footer__block div.footer__social",
                x: "50%",
                y: -10,
            },
            {
                id: 19,
                block: "div.container div.header div.header__container div.header__middle div.header__wrapper div.header__layout.header__layout--middle div.header__column.header__column--right div.header__section div.basket.j-basket-header",
                x: 0,
                y: 0,
            },
        ],
    },
    {
        page: "/yzohnutyi-pyntset-mary-lash-s4-mini-l-dlia-narashchyvanyia-resnyts-c-diamond-napylenyem/",
        cherries: [
            {
                id: 20,
                block: ".product-price__item",
                x: "120%",
                y: -10,
            },
        ],
    },
    {
        page: "/mary-lash-zakrepytel-dlia-resnyts-chernyi-10ml/",
        cherries: [
            {
                id: 21,
                block: "div.container main#main.main div.wrapper section.product div.product__grid div.product__column.product__column--right div.product__column-container.j-product-right-column div.product__column-item div.product__group div.product__group-item.j-product-block.j-product-block__list-item div div.product__section.product__section--header div.product-header div.product-header__row.product-header__row--top div.product-header__block.product-header__block--wide h1.product-title",
                x: "90%",
                y: 50,
            },
        ],
    },
    {
        page: "/checkout/",
        cherries: [
            {
                id: 22,
                block: null,
                x: 15,
                y: 0,
            },
            {
                id: 23,
                block: null,
                x: 24,
                y: 0,
            },
        ],
    },
    {
        page: "/product-category/brovyst-ru/preparaty-ru/botoks-ru/",
        cherries: [
            {
                id: 24,
                block: "div.container main#main.main div.wrapper div.catalog div.catalog__top-row div.catalog__top-col.catalog__top-col--left h1#j-catalog-header.main-h",
                x: "50%",
                y: -50,
            },
        ],
    },
    {
        page: "/kontakty/",
        cherries: [
            {
                id: 25,
                block: "div.container main#main.main div.wrapper div.layout div.layout-main div.layout-main-inner section.page div.contacts-content div.contacts-main div.text div.contacts-info div.contacts-address.contacts-msg-t address span div.locations div.location:nth-of-type(2)",
                x: 0,
                y: -50,
            },
        ],
    },
    {
        page: "/product-category/kosmetyka-ru/dekorativnaya-kosmetika/",
        cherries: [
            {
                id: 26,
                block: "div.container main#main.main div.wrapper div.catalog div.catalog__top-row div.catalog__top-col.catalog__top-col--left h1#j-catalog-header.main-h",
                x: "50%",
                y: -50,
            },
        ],
    },
    {
        page: "/onlain-kurs-korrektsyia-asymmetryy-hlaz-pry-narashchyvanyy-resnyts/",
        cherries: [
            {
                id: 27,
                block: "div.container main#main.main div.wrapper section.product div.product__grid div.product__column.product__column--left div.product__column-container.j-product-left-column div.product__column-item div.product__group.product__group--tabs div.product__group-item div div.product__section div.product-description.j-product-description.product-description--collapsible div.text h2:nth-of-type(3)",
                x: "50%",
                y: -50,
            },
        ],
    },
    {
        page: "/lamynyrovanye-resnyts-s-nulia/",
        cherries: [
            {
                id: 28,
                block: "div.container main#main.main div.wrapper section.product div.product__grid div.product__column.product__column--right div.product__column-container.j-product-right-column div.product__column-item div.product__group div.product__group-item.j-product-block.j-product-block__list-item div div.product__section.product__section--price div.product__row div.product__block div.product-toolbar div.product-toolbar__item button.favorites-button.j-widget-favorites-add div.favorites-button__text",
                x: "50%",
                y: -50,
            },
        ],
    },
    {
        page: "/trendovye-effekty/",
        cherries: [
            {
                id: 29,
                block: "div.container main#main.main div.wrapper section.product div.product__grid div.product__column.product__column--left div.product__column-container.j-product-left-column div.product__column-item div.product__group.product__group--tabs div.product__group-item div div.product__section div.product-description.j-product-description.product-description--collapsible div.text h3",
                x: "50%",
                y: -50,
            },
        ],
    },
    {
        page: "/onlain-kurs-fokus-na-resnytsakh-base/",
        cherries: [
            {
                id: 30,
                block: "div.container main#main.main div.wrapper section.product div.product__grid div.product__column.product__column--right div.product__column-container.j-product-right-column div.product__column-item div.product__group div.product__group-item.j-product-block.j-product-block__list-item div div.product__section.product__section--price div.product__row div.product__block.product__block--wide div.product-price div.product-price__box div.product-price__item",
                x: "120%",
                y: 50,
            },
        ],
    },
    {
        page: "/kursy-brovysta/",
        cherries: [
            {
                id: 31,
                block: "div.container main#main.main div.wrapper div.catalog div.catalog__middle.j-catalog-sticker-parent div.catalog__middle-col.catalog__middle-col--content.catalog__middle-col--shifted-right div.catalog__content div#j-catalog-seo.layout-main-seo section.catalog__text div.seo-text div.text h3:nth-of-type(3)",
                x: "50%",
                y: -50,
            },
        ],
    },
    {
        page: "/product-category/lamymejker-ru/",
        cherries: [
            {
                id: 32,
                block: "div.container main#main.main div.wrapper div.catalog div.catalog__middle.j-catalog-sticker-parent div.catalog__middle-col.catalog__middle-col--content.catalog__middle-col--shifted-right div.catalog__content ul.catalogGrid.catalog-grid.catalog-grid--m.catalog-grid--sidebar li.catalog-grid__item:nth-of-type(6)",
                x: "50%",
                y: -50,
            },
        ],
    },
    {
        page: "/m-pro-size-uchebno-metodycheskoe-posobye-po-narashchyvanyiu-resnyts/",
        cherries: [
            {
                id: 33,
                block: ".product__section .text h3:nth-of-type(2)",
                x: "50%",
                y: -50,
            },
        ],
    },
    {
        page: "/klei-dlia-narashchyvanyia-resnyts-prozrachnyi-m-clear-3-ml/",
        cherries: [
            {
                id: 34,
                block: "div.container main#main.main div.wrapper section.product div.product__grid div.product__column.product__column--right div.product__column-container.j-product-right-column div.product__column-item div.product__group div.product__group-item.j-product-block.j-product-block__list-item div.product-heading.product-heading--first div.product-heading__title div#comments",
                x: "50%",
                y: -50,
            },
        ],
    },
    {
        page: "/klei-dlia-narashchyvanyia-resnyts-m1-5ml/",
        cherries: [
            {
                id: 35,
                block: ".product-price__item",
                x: "50%",
                y: -50,
            },
        ],
    },
    {
        page: "/klei-dlia-narashchyvanyia-resnyts-m3-10ml/",
        cherries: [
            {
                id: 36,
                block: "div.container main#main.main div.wrapper section.product div.product__grid div.product__column.product__column--left div.product__column-container.j-product-left-column div.product__column-item div.product__group.product__group--tabs div.j-product-block__tab div.product__section div.product-description.j-product-description.product-description--collapsible.is-collapsed div.text div.table",
                x: "50%",
                y: 50,
            },
        ],
    },
    {
        page: "/max-size-uchebno-metodycheskoe-posobye-po-narashchyvanyiu-resnyts/",
        cherries: [
            {
                id: 37,
                block: ".product__column-item .product-heading__title",
                x: "50%",
                y: -50,
            },
        ],
    },
    {
        page: "/product/mary-lash-nabor-prepodavatelya-doski-realistichnye/",
        cherries: [
            {
                id: 38,
                block: ".product-header",
                x: "50%",
                y: -50,
            },
        ],
    },
    {
        page: "/kiko-milano-nabor-po-ukhodu-za-hubamy-holiday-wonderlights-santas-secret-lip-care-gift-set/",
        cherries: [
            {
                id: 39,
                block: ".product-title",
                x: "50%",
                y: -50,
            },
        ],
    },
    {
        page: "/product/uchebnyj-trenirovochnyj-maneken-dlya-narashhivaniya-resnicz/",
        cherries: [
            {
                id: 40,
                block: ".product-title",
                x: "50%",
                y: -50,
            },
        ],
    },
    {
        page: "/product/mary-lash-nozhniczy-dlya-brovej-i-resnicz/",
        cherries: [
            {
                id: 41,
                block: ".product-price__item",
                x: "50%",
                y: -50,
            },
        ],
    },
    {
        page: "/opt/",
        cherries: [
            {
                id: 42,
                block: ".mlp-grid-2 .mlp-card",
                x: "50%",
                y: -50,
            },
        ],
    },
    {
        page: "/patchy-chernye-kollahenovye-dlia-led-narashchyvanyia-1sht./",
        cherries: [
            {
                id: 43,
                block: ".product-price__item",
                x: "50%",
                y: -50,
            },
        ],
    },
    {
        page: "/podstavka-dlia-7-ty-pyntsetov-s-mahnytamy/",
        cherries: [
            {
                id: 44,
                block: ".product-title",
                x: "50%",
                y: -50,
            },
        ],
    },
    {
        page: "/povyshenye-kvalyfykatsyy-leshmeikera/",
        cherries: [
            {
                id: 45,
                block: "div.container main#main.main div.wrapper div.catalog div.catalog__middle.j-catalog-sticker-parent div.catalog__middle-col.catalog__middle-col--content.catalog__middle-col--shifted-right div.catalog__content div#j-catalog-seo.layout-main-seo section.catalog__text div.seo-text div.text",
                x: "50%",
                y: 100,
            },
        ],
    },
    {
        page: "/product/mary-lash-penka-dlya-resnicz-i-brovej-sherry-150ml/",
        cherries: [
            {
                id: 46,
                block: ".gallery__photos-container",
                x: "50%",
                y: "50%",
            },
        ],
    },
    {
        page: "/product/marylash-pinczet-skoshennyj-dlya-brovej-silver/",
        cherries: [
            {
                id: 47,
                block: ".product-price__item",
                x: "50%",
                y: -50,
            },
        ],
    },
    {
        page: "/mary-lash-sezonenko-pyntset-dlia-vydelenyia-resnyts-k1-s-nasechkamy-pod-uhlom/",
        cherries: [
            {
                id: 48,
                block: "div.container main#main.main div.wrapper section.product div.product__grid div.product__column.product__column--left div.product__column-container.j-product-left-column div.product__column-item div.product__group.product__group--tabs div.j-product-block__tab div.product__section div.product-description.j-product-description.product-description--collapsible.is-collapsed div.text",
                x: "50%",
                y: 100,
            },
        ],
    },
    {
        page: "/profile/ordersList/",
        cherries: [
            {
                id: 49,
                block: "div.container main#main.main div.wrapper div.layout div.layout-main div.layout-main-inner section.profile h1.main-h",
                x: "50%",
                y: 0,
            },
        ],
    },
    {
        page: "/profile/favorites/",
        cherries: [
            {
                id: 50,
                block: "div.container main#main.main div.wrapper div.layout div.layout-main div.layout-main-inner.__wishlist section.wishlist.catalog header.wishlist-header h1.main-h",
                x: "50%",
                y: 0,
            },
        ],
    },
    {
        page: "/mary-academy/1320/",
        cherries: [
            {
                id: 51,
                block: "div.container main#main.main div.wrapper div.layout div.layout-main div.layout-main-inner section.page div.page-content div.article-text .hero:nth-of-type(3)",
                x: "80%",
                y: -50,
            },
        ],
    },
    {
        page: "/prohrama-loialnosti-mary-lash-pro/",
        cherries: [
            {
                id: 52,
                block: ".how-it-works",
                x: 20,
                y: -50,
            },
        ],
    },
    {
        page: "/product-category/rashodnye-materialy/prostyni/",
        cherries: [
            {
                id: 53,
                block: "div.container main#main.main div.wrapper div.catalog div.catalog__top-row div.catalog__top-col.catalog__top-col--left h1#j-catalog-header.main-h",
                x: "50%",
                y: -50,
            },
        ],
    },
    {
        page: "/sertyfykaty/",
        cherries: [
            {
                id: 54,
                block: ".catalog-grid__item:nth-of-type(2)",
                x: "50%",
                y: "50%",
            },
        ],
    },
    {
        page: "/sylykonovyi-braslet-s-derzhatelem-pyntseta-chernyi/",
        cherries: [
            {
                id: 55,
                block: ".product-title",
                x: "50%",
                y: -50,
            },
        ],
    },
    {
        page: "/product-category/rashodnye-materialy/skotch-ru/",
        cherries: [
            {
                id: 56,
                block: ".catalog-grid__item:nth-of-type(6)",
                x: "50%",
                y: -50,
            },
        ],
    },
    {
        page: "/faq/",
        cherries: [
            {
                id: 57,
                block: ".faq-item:nth-of-type(1) .faq-answer",
                x: "50%",
                y: 50,
            },
            {
                id: 58,
                block: ".faq-item:nth-of-type(4) .faq-answer",
                x: "50%",
                y: 10,
            },
        ],
    },
    {
        page: "/product/kodi-klej-dlya-laminirovaniya-5g/",
        cherries: [
            {
                id: 59,
                block: ".product-title",
                x: "50%",
                y: -50,
            },
        ],
    },
    {
        page: "/product/zola-kraska-dlya-brovej-s-kollagenom-eyebrow-tint-04-dark-brown-15ml/",
        cherries: [
            {
                id: 60,
                block: ".product-title",
                x: "50%",
                y: -50,
            },
        ],
    },
    {
        page: "/color-lab-nabor-dlia-lamynyrovanyia-browlash-lamination-classic-system/",
        cherries: [
            {
                id: 61,
                block: ".product-title",
                x: "50%",
                y: -50,
            },
        ],
    },
    {
        page: "/novynky/",
        cherries: [
            {
                id: 62,
                block: null,
                x: "50%",
                y: "50%",
            },
        ],
    },
    {
        page: "/podstavka-s-naklonom-pod-planshetku-s-otverstyem-dlia-lunky-y-s-uporom-pod-ruku/",
        cherries: [
            {
                id: 63,
                block: "#main > div.wrapper > section > div.product__grid > div.product__column.product__column--left > div > div:nth-child(2) > div > div:nth-child(2) > div > div > div > p:nth-child(6)",
                x: "120%",
                y: -10,
            },
        ],
    },
    {
        page: "/mary-lash-academy-ai-yntensyv-yz-biuty-retushy/",
        cherries: [
            {
                id: 64,
                block: "#main > div.wrapper > section > div.product__grid > div.product__column.product__column--left > div > div:nth-child(2) > div > div:nth-child(2) > div > div > div > p:nth-child(6)",
                x: "120%",
                y: -10,
            },
        ],
    },
    {
        page: "/boks-dlia-resnyts-akrylovyi-na-12-planshetok-s-kryshkoi-pod-planshetku-y-otverstyem-dlia-lunky/",
        cherries: [
            {
                id: 65,
                block: "#main > div.wrapper > section > div.product__grid > div.product__column.product__column--left > div > div:nth-child(2) > div > div:nth-child(2) > div > div > div > p:nth-child(6)",
                x: "120%",
                y: -10,
            },
        ],
    },
    {
        page: "/m-pro-size-uchebno-metodycheskoe-posobye-po-narashchyvanyiu-resnyts/2787/",
        cherries: [
            {
                id: 66,
                block: null,
                x: "50%",
                y: "50%",
            },
        ],
    },
    {
        page: "/product-category/leshmejker-ru/",
        cherries: [
            {
                id: 67,
                block: null,
                x: "50%",
                y: 100,
            },
        ],
    },
    {
        page: "/test-set-remuverov-vybery-svoi/",
        cherries: [
            {
                id: 68,
                block: null,
                x: "50%",
                y: 100,
            },
        ],
    },
    {
        page: "/product/kiko-milano-joyful-holiday-oh-oh-oh-my-lips-kit-2/",
        cherries: [
            {
                id: 69,
                block: null,
                x: "50%",
                y: 100,
            },
        ],
    },
    {
        page: "/kursy-kontenta/",
        cherries: [
            {
                id: 70,
                block: null,
                x: "50%",
                y: 100,
            },
        ],
    },
    {
        page: "/1000-hrn/2178/",
        cherries: [
            {
                id: 71,
                block: null,
                x: "50%",
                y: 100,
            },
        ],
    },
    {
        page: "/prohrama-loialnosti-mary-lash-pro/?utm_source=&utm_medium=&utm_campaign=&utm_content=ribbon",
        cherries: [
            {
                id: 72,
                block: null,
                x: "50%",
                y: 100,
            },
        ],
    },
    {
        page: "/store-reviews/",
        cherries: [
            {
                id: 73,
                block: null,
                x: "50%",
                y: 100,
            },
        ],
    },
    {
        page: "https://marylash.pro/product/shapochki-belye-100-sht/",
        cherries: [
            {
                id: 74,
                block: null,
                x: "50%",
                y: 100,
            },
        ],
    },
    {
        page: "/haid-po-kleiu-v-podarok/",
        cherries: [
            {
                id: 75,
                block: null,
                x: "50%",
                y: 100,
            },
        ],
    },
    {
        page: "/materyaly-y-aksessuary/",
        cherries: [
            {
                id: 76,
                block: null,
                x: "50%",
                y: 100,
            },
        ],
    },
    {
        page: "/ventyliator-dlia-sushky-resnyts-rozovyi/",
        cherries: [
            {
                id: 77,
                block: null,
                x: "50%",
                y: 100,
            },
        ],
    },
    {
        page: "/product-category/rashodnye-materialy/izolyacziya-nizhnih-resnicz/",
        cherries: [
            {
                id: 78,
                block: null,
                x: "50%",
                y: 100,
            },
        ],
    },
    {
        page: "/product/nebulajzer-rozovyj-so-strazikom/",
        cherries: [
            {
                id: 79,
                block: null,
                x: "50%",
                y: 100,
            },
        ],
    },
    {
        page: "/startovyi-nabor-dlia-lamymeikera/",
        cherries: [
            {
                id: 80,
                block: null,
                x: "50%",
                y: 100,
            },
        ],
    },
    {
        page: "/nabor-raskhodnykh-materyalov-gold/",
        cherries: [
            {
                id: 81,
                block: null,
                x: "50%",
                y: 100,
            },
        ],
    },
    {
        page: "/product/kontejner-dlya-sterilizaczii-i-dezinfekczii-instrumentov/",
        cherries: [
            {
                id: 82,
                block: null,
                x: "50%",
                y: 100,
            },
        ],
    },
    {
        page: "/resnytsy-blond-honey-brown-volume-lashes-007-m-mix-6-12/",
        cherries: [
            {
                id: 83,
                block: null,
                x: "50%",
                y: 100,
            },
        ],
    },
    {
        page: "/product-category/rashodnye-materialy/prostyni/",
        cherries: [
            {
                id: 84,
                block: null,
                x: "50%",
                y: 100,
            },
        ],
    },
    {
        page: "/startovyi-nabor-dlia-leshmeikera/",
        cherries: [
            {
                id: 85,
                block: null,
                x: "50%",
                y: 100,
            },
        ],
    },
    {
        page: "/policy/",
        cherries: [
            {
                id: 86,
                block: null,
                x: "50%",
                y: 100,
            },
        ],
    },
];
