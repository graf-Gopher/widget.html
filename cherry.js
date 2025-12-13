document.addEventListener("DOMContentLoaded", function () {
    (async function () {
        // if (!window.__userData) return;

        let cherriesFound = 0;
        // const user = window.__userData.email;
        const user = "test email";

        const config = await fetch("./cherries.json").then((r) => r.json());
        const currentPage = window.location.pathname;
        console.log(currentPage);

        const pageConfig = config.find((p) => p.page === currentPage);
        const totalCherries = 25;
        // const totalCherries = pageConfig.cherries.length;

        const panel = document.createElement("div");
        panel.classList.add("cherry_block");
        panel.id = "send-cherry";
        panel.innerHTML = `
    <span id="cherry-icon">🍒</span>
    <span id="cherry-counter">0/${totalCherries}</span>
    <button id="send-btn"><svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 0 24 24" width="32px" fill="#cf125e"><path d="M0 0h24v24H0z" fill="none"/><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg></button>
  `;
        document.body.appendChild(panel);

        if (pageConfig) {
            pageConfig.cherries.forEach((pos) => {
                const cherry = document.createElement("div");
                cherry.classList.add("cherry");
                cherry.textContent = "🍒";
                cherry.style.position = "absolute";
                cherry.style.left = pos.x + "px";
                cherry.style.top = pos.y + "px";
                cherry.style.cursor = "pointer";
                cherry.style.fontSize = "24px";
                cherry.style.zIndex = "9999";
                cherry.addEventListener("click", () => {
                    cherriesFound++;
                    document.getElementById("cherry-counter").textContent = cherriesFound + "/" + totalCherries;
                    cherry.remove();
                });
                document.body.appendChild(cherry);
            });
        }

        document.getElementById("send-cherry").addEventListener("click", async () => {
            try {
                await fetch("https://script.google.com/macros/s/AKfycbz4IrFHq6XC_BwjBH7zcrh9LDJHTJglYcU1SmWZ16ydwGshjZfp4ArTcoWvWrTf5hGpmg/exec", {
                    method: "POST",
                    headers: { "Content-Type": "text/plain;charset=utf-8" },
                    body: JSON.stringify({
                        user: user,
                        found: cherriesFound,
                    }),
                    redirect: "follow",
                });
                alert("Результат відправлено менеджеру!");
            } catch (e) {
                console.log(e);
                console.log(JSON.stringify(e, null, 2));
                console.log(e.status);

                // if (e.message) {
                //     alert(e.message);
                // }
            }
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
