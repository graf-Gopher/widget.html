const scriptTag = Array.from(document.getElementsByTagName("script")).find((s) => s.src.includes("widget.js"));

loadWidget(scriptTag);

function loadWidget(scriptTag) {
    const odoo = scriptTag.getAttribute("data-odo") || "#";
    const odooMethod = scriptTag.getAttribute("data-odoo") || "#";
    const files = scriptTag.getAttribute("data-files") || "#";
    const title = scriptTag.getAttribute("data-title") || "#";
    const telegram = scriptTag.getAttribute("data-tel") || "#";
    const viber = scriptTag.getAttribute("data-vib") || "#";
    const facebook = scriptTag.getAttribute("data-fac") || "#";

    (async function () {
        const styles = [`${files}/call_style.min.css`, `${files}/ui_style.min.css`, `${odoo}/im_livechat/external_lib.css`, `${files}/style.css`];
        styles.forEach((styleHref) => {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = styleHref;
            document.head.appendChild(link);
        });

        // const scripts = [`${files}/script.js`, `${odoo}/im_livechat/external_lib.js`, `${odoo}/im_livechat/loader/1`];
        const scripts = [`${files}/script.js`];
        scripts.forEach((scriptHref) => {
            const script = document.createElement("script");
            script.src = scriptHref;
            script.setAttribute("data-odoo", odooMethod);
            document.head.appendChild(script);
        });

        const widget = document.createElement("div");
        widget.id = "callback-widget";
        widget.innerHTML = `
        <div>
            <div class="callback-widget-button-shadow callback-widget-button-hide"></div>
            <div style="display: none">
                <a class="callback-widget-button-social-item" title="">
                    <i></i>
                    <span class="callback-widget-button-social-tooltip"></span>
                </a>
            </div>

            <div dir="ltr" class="callback-widget-button-wrapper callback-widget-button-position-bottom-right callback-widget-button-visible">
                <div class="callback-widget-button-social callback-widget-button-hide">
                    <!--<a
                        class="callback-widget-button-social-item callback-widget-button-openline_livechat"
                        title=""
                        style="
                            background-color: rgb(255, 91, 85);
                            background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2231%22%20height%3D%2228%22%20viewBox%3D%220%200%2031%2028%22%3E%3Cpath%20fill%3D%22%23ffffff%22%20fill-rule%3D%22evenodd%22%20d%3D%22M23.29%2013.25V2.84c0-1.378-1.386-2.84-2.795-2.84h-17.7C1.385%200%200%201.462%200%202.84v10.41c0%201.674%201.385%203.136%202.795%202.84H5.59v5.68h.93c.04%200%20.29-1.05.933-.947l3.726-4.732h9.315c1.41.296%202.795-1.166%202.795-2.84zm2.795-3.785v4.733c.348%202.407-1.756%204.558-4.658%204.732h-8.385l-1.863%201.893c.22%201.123%201.342%202.127%202.794%201.893h7.453l2.795%203.786c.623-.102.93.947.93.947h.933v-4.734h1.863c1.57.234%202.795-1.02%202.795-2.84v-7.57c0-1.588-1.225-2.84-2.795-2.84h-1.863z%22/%3E%3C/svg%3E');
                        "
                        onclick="document.querySelector('.o_website_livechat_button').click();"
                    >
                        <i></i>
                        <span class="callback-widget-button-social-tooltip">${title} - Chat</span> </a
                    >-->
                    <a
                        class="callback-widget-button-social-item ui-icon ui-icon-service-fb connector-icon-45"
                        title=""
                        href="${facebook}"
                        target="_blank"
                        rel="nofollow"
                        id="messenger-btn"
                    >
                        <i></i>
                        <span class="callback-widget-button-social-tooltip">${title} - Facebook</span> </a
                    ><a class="callback-widget-button-social-item ui-icon ui-icon-service-viber connector-icon-45" title="" href="${viber}" target="_blank" id="viber-btn">
                        <i></i>
                        <span class="callback-widget-button-social-tooltip">${title} - Viber</span> </a
                    ><a
                        class="callback-widget-button-social-item ui-icon ui-icon-service-telegram connector-icon-45"
                        title=""
                        href="${telegram}"
                        target="_blank"
                        rel="nofollow"
                        id="telegram-btn"
                    >
                        <i></i>
                        <span class="callback-widget-button-social-tooltip">${title} - Telegram</span>
                    </a>
                </div>
                <div class="callback-widget-button-inner-container">
                    <div class="callback-widget-button-inner-mask" style="background: #ff5b55"></div>
                    <div class="callback-widget-button-block">
                        <div class="callback-widget-button-pulse callback-widget-button-pulse-animate" style="border-color: #ff5b55"></div>
                        <div class="callback-widget-button-inner-block" style="background: #ff5b55">
                            <div class="callback-widget-button-icon-container">
                                <div class="callback-widget-button-inner-item" style="display: none">
                                    <svg class="callback-crm-button-icon" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 28">
                                        <path
                                            class="callback-crm-button-webform-icon"
                                            fill=" #ffffff"
                                            fill-rule="evenodd"
                                            d="M815.406703,961 L794.305503,961 C793.586144,961 793,961.586144 793,962.305503 L793,983.406703 C793,984.126062 793.586144,984.712206 794.305503,984.712206 L815.406703,984.712206 C816.126062,984.712206 816.712206,984.126062 816.712206,983.406703 L816.712206,962.296623 C816.703325,961.586144 816.117181,961 815.406703,961 L815.406703,961 Z M806.312583,979.046143 C806.312583,979.454668 805.975106,979.783264 805.575462,979.783264 L796.898748,979.783264 C796.490224,979.783264 796.161627,979.445787 796.161627,979.046143 L796.161627,977.412044 C796.161627,977.003519 796.499105,976.674923 796.898748,976.674923 L805.575462,976.674923 C805.983987,976.674923 806.312583,977.0124 806.312583,977.412044 L806.312583,979.046143 L806.312583,979.046143 Z M813.55946,973.255747 C813.55946,973.664272 813.221982,973.992868 812.822339,973.992868 L796.889868,973.992868 C796.481343,973.992868 796.152746,973.655391 796.152746,973.255747 L796.152746,971.621647 C796.152746,971.213122 796.490224,970.884526 796.889868,970.884526 L812.813458,970.884526 C813.221982,970.884526 813.550579,971.222003 813.550579,971.621647 L813.550579,973.255747 L813.55946,973.255747 Z M813.55946,967.45647 C813.55946,967.864994 813.221982,968.193591 812.822339,968.193591 L796.889868,968.193591 C796.481343,968.193591 796.152746,967.856114 796.152746,967.45647 L796.152746,965.82237 C796.152746,965.413845 796.490224,965.085249 796.889868,965.085249 L812.813458,965.085249 C813.221982,965.085249 813.550579,965.422726 813.550579,965.82237 L813.550579,967.45647 L813.55946,967.45647 Z"
                                            transform="translate(-793 -961)"
                                        ></path>
                                    </svg>
                                </div>

                                <div class="callback-widget-button-inner-item" style="display: none">
                                    <svg class="callback-crm-button-icon" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 30">
                                        <path
                                            class="callback-crm-button-call-icon"
                                            fill="#ffffff"
                                            fill-rule="evenodd"
                                            d="M940.872414,978.904882 C939.924716,977.937215 938.741602,977.937215 937.79994,978.904882 C937.08162,979.641558 936.54439,979.878792 935.838143,980.627954 C935.644982,980.833973 935.482002,980.877674 935.246586,980.740328 C934.781791,980.478121 934.286815,980.265859 933.840129,979.97868 C931.757607,978.623946 930.013117,976.882145 928.467826,974.921839 C927.701216,973.947929 927.019115,972.905345 926.542247,971.731659 C926.445666,971.494424 926.463775,971.338349 926.6509,971.144815 C927.36922,970.426869 927.610672,970.164662 928.316918,969.427987 C929.300835,968.404132 929.300835,967.205474 928.310882,966.175376 C927.749506,965.588533 927.206723,964.77769 926.749111,964.14109 C926.29156,963.50449 925.932581,962.747962 925.347061,962.154875 C924.399362,961.199694 923.216248,961.199694 922.274586,962.161118 C921.55023,962.897794 920.856056,963.653199 920.119628,964.377388 C919.437527,965.045391 919.093458,965.863226 919.021022,966.818407 C918.906333,968.372917 919.274547,969.840026 919.793668,971.269676 C920.856056,974.228864 922.473784,976.857173 924.43558,979.266977 C927.085514,982.52583 930.248533,985.104195 933.948783,986.964613 C935.6148,987.801177 937.341181,988.444207 939.218469,988.550339 C940.510236,988.625255 941.632988,988.288132 942.532396,987.245549 C943.148098,986.533845 943.842272,985.884572 944.494192,985.204083 C945.459999,984.192715 945.466036,982.969084 944.506265,981.970202 C943.359368,980.777786 942.025347,980.091055 940.872414,978.904882 Z M940.382358,973.54478 L940.649524,973.497583 C941.23257,973.394635 941.603198,972.790811 941.439977,972.202844 C940.97488,970.527406 940.107887,969.010104 938.90256,967.758442 C937.61538,966.427182 936.045641,965.504215 934.314009,965.050223 C933.739293,964.899516 933.16512,965.298008 933.082785,965.905204 L933.044877,966.18514 C932.974072,966.707431 933.297859,967.194823 933.791507,967.32705 C935.117621,967.682278 936.321439,968.391422 937.308977,969.412841 C938.23579,970.371393 938.90093,971.53815 939.261598,972.824711 C939.401641,973.324464 939.886476,973.632369 940.382358,973.54478 Z M942.940854,963.694228 C940.618932,961.29279 937.740886,959.69052 934.559939,959.020645 C934.000194,958.902777 933.461152,959.302642 933.381836,959.8878 L933.343988,960.167112 C933.271069,960.705385 933.615682,961.208072 934.130397,961.317762 C936.868581,961.901546 939.347628,963.286122 941.347272,965.348626 C943.231864,967.297758 944.53673,969.7065 945.149595,972.360343 C945.27189,972.889813 945.766987,973.232554 946.285807,973.140969 L946.55074,973.094209 C947.119782,972.993697 947.484193,972.415781 947.350127,971.835056 C946.638568,968.753629 945.126778,965.960567 942.940854,963.694228 Z"
                                            transform="translate(-919 -959)"
                                        ></path>
                                    </svg>
                                </div>

                                <div class="callback-widget-button-inner-item callback-widget-button-icon-animation">
                                    <svg class="callback-crm-button-icon callback-crm-button-icon-active" width="28" height="29" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            class="callback-crm-button-chat-icon"
                                            d="M25.99 7.744a2 2 0 012 2v11.49a2 2 0 01-2 2h-1.044v5.162l-4.752-5.163h-7.503a2 2 0 01-2-2v-1.872h10.073a3 3 0 003-3V7.744zM19.381 0a2 2 0 012 2v12.78a2 2 0 01-2 2h-8.69l-5.94 6.453V16.78H2a2 2 0 01-2-2V2a2 2 0 012-2h17.382z"
                                            fill=" #ffffff"
                                            fill-rule="evenodd"
                                        ></path>
                                    </svg>
                                </div>
                            </div>
                            <div class="callback-widget-button-inner-item callback-widget-button-close">
                                <svg class="callback-widget-button-icon callback-widget-button-close-item" xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 29 29">
                                    <path
                                        fill="#FFF"
                                        fill-rule="evenodd"
                                        d="M18.866 14.45l9.58-9.582L24.03.448l-9.587 9.58L4.873.447.455 4.866l9.575 9.587-9.583 9.57 4.418 4.42 9.58-9.577 9.58 9.58 4.42-4.42"
                                    ></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
        document.body.appendChild(widget);
    })();
}
