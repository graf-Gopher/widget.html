document.addEventListener("DOMContentLoaded", function () {
    (async function () {
        const userId = window.GLOBAL?.USER_ID;
        if (!userId) return;

        let cherriesFound = parseInt(
            document.cookie
                .split(";")
                .find((c) => c.trim().startsWith("cherry_counter="))
                ?.split("=")[1] || 0
        );

        const config = await fetch("https://cdn.jsdelivr.net/gh/graf-Gopher/widget.html/cherries.json").then((r) => r.json());
        const currentPage = window.location.pathname;

        const pageConfig = config.find((p) => currentPage.includes(p.page));

        const totalCherries = config.reduce((acc, p) => acc + p.cherries.length, 0);

        const panel = document.createElement("div");
        panel.classList.add("cherry_block");
        panel.id = "send-cherry";
        panel.innerHTML = `
            <span id="cherry-icon">🍒</span>
            <span id="cherry-counter">0/${totalCherries}</span>
            <button id="send-btn"><svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 0 24 24" width="40px" fill="#cf125e"><path d="M0 0h24v24H0z" fill="none"/><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg></button>
        `;
        document.body.appendChild(panel);

        if (pageConfig) {
            pageConfig.cherries.forEach((cherryConfig) => {
                if (pageConfig.page.includes("checkout")) {
                    const date = new Date();
                    if (cherryConfig.x === 15 && date.getDate() !== 15) {
                        return;
                    } else if (cherryConfig.x === 24 && date.getDate() !== 24) {
                        return;
                    }
                }
                let container = cherryConfig.block ? document.querySelector(cherryConfig.block) : null;
                console.log(container);

                const cherry = document.createElement("div");
                cherry.classList.add("cherry");
                cherry.textContent = "🍒";
                cherry.style.position = "absolute";
                cherry.style.cursor = "pointer";
                cherry.style.fontSize = "40px";
                cherry.style.zIndex = "999";

                cherry.addEventListener("click", () => {
                    cherriesFound++;
                    document.getElementById("cherry-counter").textContent = cherriesFound + "/" + totalCherries;
                    const expirationDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
                    document.cookie = `cherry_counter=${cherriesFound}; expires=${expirationDate.toUTCString()}; path=/`;
                    cherry.remove();
                });

                if (container) {
                    if (getComputedStyle(container).position === "static") {
                        container.style.position = "relative";
                    }
                    cherry.style.left = typeof cherryConfig.x === "number" ? cherryConfig.x + "px" : cherryConfig.x;
                    cherry.style.top = typeof cherryConfig.y === "number" ? cherryConfig.y + "px" : cherryConfig.y;
                    container.appendChild(cherry);
                } else {
                    cherry.style.left = Math.floor(Math.random() * window.innerWidth) + "px";
                    cherry.style.top = Math.floor(Math.random() * window.innerHeight) + "px";
                    document.body.appendChild(cherry);
                }
            });
        }

        document.getElementById("send-cherry").addEventListener("click", async () => {
            await fetch("https://script.google.com/macros/s/AKfycbyXJauECNk_5kdlNqwdtf42gjU02QuRro5LSflbLggNSJrLDjeSr3VWlQ2Mi3_Kce3M/exec", {
                method: "POST",
                headers: { "Content-Type": "text/plain;charset=utf-8" },
                body: JSON.stringify({
                    user: userId,
                    found: cherriesFound,
                }),
                redirect: "follow",
            });
            alert("Дякуємо! Результат відправлено менеджеру!");
        });
    })();
});

// Заходите на Google Apps Script.

// Створюєте новий проект.

// Пишете код:

// js
// function doPost(e) {
//   var data = JSON.parse(e.postData.contents);
//   MailApp.sendEmail("manager@example.com",
//     "Звіт по вишеньках",
//     "Користувач " + data.user + " знайшов " + data.found + " вишеньок"
//   );
//   return ContentService.createTextOutput("OK");
// }
// Публікуєте як Web App (Deploy → New Deployment → Web App).

// Отримуєте URL, наприклад: https://script.google.com/macros/s/AKfycbx1234567890/exec
