function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

document.addEventListener("DOMContentLoaded", function () {
    (async function () {
        let sendblock = false;

        await delay(3000);
        const userId = window.GLOBAL?.USER_ID;
        if (!userId) return;

        let cherriesFound = parseInt(
            document.cookie
                .split(";")
                .find((c) => c.trim().startsWith("cherry_counter="))
                ?.split("=")[1] || 0
        );

        let cherriesFounds = document.cookie
            .split(";")
            .find((c) => c.trim().startsWith("cherry_list="))
            ?.split("=")[1];

        try {
            cherriesFounds = JSON.parse(cherriesFounds);
        } catch {
            cherriesFounds = [];
        }

        // const config = await fetch("https://marylash.pro/cherries.json").then((r) => r.json());
        const config = cherries;
        const currentPage = window.location.pathname;

        const pageConfig = config.reduce((best, p) => {
            if (currentPage.includes(p.page)) {
                if (!best || p.page.length > best.page.length) {
                    return p;
                }
            }
            return best;
        }, null);

        const totalCherries = config.reduce((acc, p) => acc + p.cherries.length, 0);

        const panel = document.createElement("div");
        panel.classList.add("cherry_block");
        panel.id = "send-cherry";
        panel.innerHTML = `
            <span id="cherry-icon">🍒</span>
            <span id="cherry-counter">${cherriesFound}/${totalCherries}</span>
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

                if (cherriesFounds.some((id) => id === cherryConfig.id)) {
                    return;
                }
                let container = cherryConfig.block ? document.querySelector(cherryConfig.block) : null;
                // console.log(container);

                const cherry = document.createElement("div");
                cherry.classList.add("cherry");
                cherry.textContent = "🍒";
                cherry.style.position = "absolute";
                cherry.style.cursor = "pointer";
                cherry.style.fontSize = "40px";
                cherry.style.zIndex = "999";

                cherry.addEventListener("click", () => {
                    cherriesFound++;
                    cherriesFounds.push(cherryConfig.id);
                    document.getElementById("cherry-counter").textContent = cherriesFound + "/" + totalCherries;
                    const expirationDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
                    document.cookie = `cherry_counter=${cherriesFound}; expires=${expirationDate.toUTCString()}; path=/`;
                    document.cookie = `cherry_list=${JSON.stringify(cherriesFounds)}; expires=${expirationDate.toUTCString()}; path=/`;
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
            if (sendblock) return;
            sendblock = true;
            alert("Дякуємо! Результат відправлено менеджеру!");

            await fetch("https://script.google.com/macros/s/AKfycbxWy6FckE4OBZsLGUt0i8wCap9J4_abwOKmKlfmqMcYUM_n4Q5xBtIanUi6IKiTwkn0pg/exec", {
                method: "POST",
                headers: { "Content-Type": "text/plain;charset=utf-8" },
                body: JSON.stringify({
                    user: userId,
                    found: cherriesFound,
                }),
                redirect: "follow",
            });
            sendblock = false;
            // alert("Дякуємо! Результат відправлено менеджеру!");
            console.log("Cherry send complete");
        });
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
            // {
            //     id: 17,
            //     block: "div.container main#main.main div.banners-group section.banners.banners--wideblock.banners--gaps-m div.banners__container div.banners__slider.swiper-container-fade.swiper-container-initialized.swiper-container-horizontal.swiper-container-pointer-events div.banners__slider-wrapper div.banners__slider-i:nth-of-type(10) div.banners__item.banners__item--radius-none.banners__item--size-l div.banner div.banner-image",
            //     x: "50%",
            //     y: -50,
            // },
            {
                id: 18,
                block: "div.container footer.footer div.footer__container div.footer__wrapper.wrapper div.footer__columns div.footer__col div.footer__col-wrap div.footer__block div.footer__social",
                x: "50%",
                y: -10,
            },
            {
                id: 19,
                block: ".social-icons__item",
                x: "50%",
                y: 50,
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
];

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
