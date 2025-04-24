function getUTMParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const utmParams = [];
    ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].forEach((param) => {
        if (urlParams.has(param)) {
            utmParams.push(`${param}=${urlParams.get(param)}`);
        }
    });
    return utmParams.length ? utmParams.join("&") : "";
}

function sendUTMParams(link, action) {
    const utmQuery = getUTMParams();

    let utmQueryObject = {};

    if (utmQuery) {
        utmQueryObject = utmQuery.split("&").reduce((acc, param) => {
            const [key, value] = param.split("=");
            acc[key] = decodeURIComponent(value);
            return acc;
        }, {});
    }

    utmQueryObject.uid = uid;
    utmQueryObject.action = action;

    uid = genUID();

    let postToOdoo = async () => {
        const response = await fetch(link, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                jsonrpc: "2.0",
                params: utmQueryObject,
            }),
        });
        return await response;
    };

    postToOdoo()
        .then((data) => {
            console.log("response:", data);
        })
        .catch((error) => {
            console.error("error:", error);
            setTimeout(() => {
                postToOdoo()
                    .then((data) => {
                        console.log("retry response:", data);
                    })
                    .catch((error) => {
                        console.error("retry error:", error);
                    });
            }, 1000);
        });
}

const lscriptTag = document.currentScript;
const lsodoo = lscriptTag.getAttribute("data-odoo") || "#";

// const uid = ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) => (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16));
let uid = genUID();

function genUID() {
    const uid = "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) => (+c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))).toString(16));

    if (uid) {
        document.getElementById("telegram-btn").href += `?start=${uid}`;
        document.getElementById("viber-btn").href += `&context=${uid}`;
        document.getElementById("messenger-btn").href += `?ref=${uid}`;
    }
    return uid;
}

// document.addEventListener("DOMContentLoaded", function (event) {

// if (uid) {
//     document.getElementById("telegram-btn").href += `?start=${uid}`;
//     document.getElementById("viber-btn").href += `&context=${uid}`;
//     document.getElementById("messenger-btn").href += `?ref=${uid}`;
// }

const widget = document.querySelector(".callback-widget-button-wrapper");
widget.onclick = function () {
    widget.classList.toggle("callback-widget-button-bottom");

    const shadow = document.querySelector(".callback-widget-button-shadow");
    shadow.classList.toggle("callback-widget-button-hide");
    shadow.classList.toggle("callback-widget-button-show");

    const social = document.querySelector(".callback-widget-button-social");
    social.classList.toggle("callback-widget-button-hide");
    social.classList.toggle("callback-widget-button-show");
};

const telegram = document.querySelector("#telegram-btn");

// widget_chat_open_click
telegram.onclick = function () {
    sendUTMParams(lsodoo, "widget_Telegram_click");
};
const viber = document.querySelector("#viber-btn");
viber.onclick = function () {
    sendUTMParams(lsodoo, "widget_viber_click");
};
const facebook = document.querySelector("#messenger-btn");
facebook.onclick = function () {
    sendUTMParams(lsodoo, "widget_facebook_click");
};
// });
