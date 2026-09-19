const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];


// ============================================================
// MOBILE NAV
// ============================================================

const menu = $("#menu");
const nav = $("#nav");

if (menu && nav) {
    menu.addEventListener("click", () => {
        const open = nav.classList.toggle("open");

        menu.setAttribute(
            "aria-expanded",
            open
        );

        menu.setAttribute(
            "aria-label",
            open
                ? "Close navigation"
                : "Open navigation"
        );
    });

    $$("nav a").forEach((link) => {
        link.addEventListener("click", () => {
            nav.classList.remove("open");

            menu.setAttribute(
                "aria-expanded",
                "false"
            );

            menu.setAttribute(
                "aria-label",
                "Open navigation"
            );
        });
    });
}


// ============================================================
// SAFKART 2D DELIVERY ANIMATION
// ============================================================

const scene = $("#hero3d");
const rider = $("#deliveryRider");
const payment = $("#payment");
const handover = $("#handover");
const status = $("#deliveryStatus");

let animationStart = performance.now();

const animationDuration = 14000;


// ============================================================
// EASING
// ============================================================

function easeInOut(t) {
    return t < 0.5
        ? 2 * t * t
        : 1 - Math.pow(-2 * t + 2, 2) / 2;
}


// ============================================================
// ROUTE POSITION
// ============================================================

function getRoutePosition(progress) {

    if (!scene) {
        return {
            x: 0,
            y: 0,
            direction: 1
        };
    }

    const width = scene.clientWidth;
    const height = scene.clientHeight;

    const centerX = width * 0.50;
    const centerY = height * 0.53;

    const radiusX =
        Math.min(
            width * 0.38,
            145
        );

    const radiusY =
        Math.min(
            height * 0.25,
            105
        );

    const startAngle =
        -Math.PI / 2;

    const angle =
        startAngle +
        progress * Math.PI * 2;

    const x =
        centerX +
        radiusX * Math.cos(angle);

    const y =
        centerY +
        radiusY * Math.sin(angle);

    const nextAngle =
        angle + 0.01;

    const nextX =
        centerX +
        radiusX * Math.cos(nextAngle);

    const direction =
        nextX >= x
            ? 1
            : -1;

    return {
        x,
        y,
        direction
    };
}


// ============================================================
// RIDER POSITION
// ============================================================

function setRiderPosition(
    x,
    y,
    direction,
    scale = 1
) {

    if (!rider) return;

    rider.style.left =
        `${x}px`;

    rider.style.top =
        `${y}px`;

    rider.style.transform =
        `translate(-50%, -50%)
         scaleX(${direction * scale})`;
}


// ============================================================
// HIDE TEMPORARY EFFECTS
// ============================================================

function hideEffects() {

    if (payment) {
        payment.classList.remove(
            "show"
        );
    }

    if (handover) {
        handover.classList.remove(
            "show"
        );
    }
}


// ============================================================
// DELIVERY ANIMATION
// ============================================================

function animateDelivery(time) {

    if (!scene || !rider) {
        return;
    }

    const elapsed =
        (time - animationStart) %
        animationDuration;

    const progress =
        elapsed /
        animationDuration;

    hideEffects();


    // ========================================================
    // SHOP
    // 0% → 10%
    // ========================================================

    if (progress < 0.10) {

        const p =
            easeInOut(
                progress / 0.10
            );

        const route =
            getRoutePosition(0);

        setRiderPosition(
            route.x,
            route.y,
            route.direction,
            0.95 + p * 0.05
        );

        if (status) {
            status.textContent =
                p < 0.5
                    ? "ARRIVING AT SHOP"
                    : "ORDER READY";
        }
    }


    // ========================================================
    // SHOP → CUSTOMER
    // 10% → 40%
    // ========================================================

    else if (progress < 0.40) {

        const p =
            easeInOut(
                (progress - 0.10) /
                0.30
            );

        const route =
            getRoutePosition(
                p * 0.30
            );

        setRiderPosition(
            route.x,
            route.y,
            route.direction,
            1
        );

        if (status) {
            status.textContent =
                "DELIVERING ORDER";
        }
    }


    // ========================================================
    // CUSTOMER
    // 40% → 50%
    // ========================================================

    else if (progress < 0.50) {

        const p =
            (progress - 0.40) /
            0.10;

        const route =
            getRoutePosition(0.30);

        setRiderPosition(
            route.x,
            route.y,
            route.direction,
            1
        );

        if (status) {
            status.textContent =
                p < 0.5
                    ? "HANDING OVER ORDER"
                    : "PAYMENT RECEIVED";
        }

        if (
            handover &&
            p < 0.5
        ) {
            handover.classList.add(
                "show"
            );
        }

        if (
            payment &&
            p >= 0.5
        ) {
            payment.classList.add(
                "show"
            );
        }
    }


    // ========================================================
    // CUSTOMER → HOME
    // 50% → 80%
    // ========================================================

    else if (progress < 0.80) {

        const p =
            easeInOut(
                (progress - 0.50) /
                0.30
            );

        const routeProgress =
            0.30 +
            p * 0.40;

        const route =
            getRoutePosition(
                routeProgress
            );

        setRiderPosition(
            route.x,
            route.y,
            route.direction,
            1
        );

        if (status) {
            status.textContent =
                "RETURNING HOME";
        }
    }


    // ========================================================
    // HOME → SHOP
    // 80% → 100%
    // ========================================================

    else {

        const p =
            easeInOut(
                (progress - 0.80) /
                0.20
            );

        const routeProgress =
            0.70 +
            p * 0.30;

        const route =
            getRoutePosition(
                routeProgress
            );

        setRiderPosition(
            route.x,
            route.y,
            route.direction,
            1
        );

        if (status) {
            status.textContent =
                "RIDING TO SHOP";
        }
    }


    requestAnimationFrame(
        animateDelivery
    );
}


if (rider && scene) {
    requestAnimationFrame(
        animateDelivery
    );
}


// ============================================================
// MOBILE / POINTER HERO INTERACTION
// ============================================================

if (scene) {

    let targetX = 0;
    let targetY = 0;

    let currentX = 0;
    let currentY = 0;


    function updateHeroInteraction(
        clientX,
        clientY
    ) {

        const rect =
            scene.getBoundingClientRect();

        const x =
            (clientX - rect.left) /
            rect.width -
            0.5;

        const y =
            (clientY - rect.top) /
            rect.height -
            0.5;

        targetX =
            x * 2.5;

        targetY =
            y * -2;
    }


    scene.addEventListener(
        "pointermove",
        (event) => {

            updateHeroInteraction(
                event.clientX,
                event.clientY
            );
        }
    );


    scene.addEventListener(
        "pointerleave",
        () => {

            targetX = 0;
            targetY = 0;
        }
    );


    function animateHeroInteraction() {

        currentX +=
            (
                targetX -
                currentX
            ) * 0.04;

        currentY +=
            (
                targetY -
                currentY
            ) * 0.04;

        scene.style.setProperty(
            "--hero-shift-x",
            `${currentX}px`
        );

        scene.style.setProperty(
            "--hero-shift-y",
            `${currentY}px`
        );

        requestAnimationFrame(
            animateHeroInteraction
        );
    }


    animateHeroInteraction();
}


// ============================================================
// ORDER JOURNEY
// ============================================================

const journey = [
    {
        icon: "🛒",
        role: "CUSTOMER",
        title: "Order placed",
        description:
            "Choose products, filter what you need, add them to the cart and check out.",
        status: "ORDER PLACED"
    },
    {
        icon: "🏪",
        role: "SHOP",
        title: "Order being prepared",
        description:
            "The shop receives the order, gathers the items and marks it ready for pickup.",
        status: "READY FOR PICKUP"
    },
    {
        icon: "🛵",
        role: "DELIVERY",
        title: "Pickup confirmed",
        description:
            "The delivery partner accepts the ready order and completes the pickup verification.",
        status: "OUT FOR DELIVERY"
    },
    {
        icon: "✓",
        role: "CUSTOMER",
        title: "Delivered",
        description:
            "The delivery partner reaches the customer and the order is completed.",
        status: "DELIVERED"
    }
];


function setJourney(index) {

    if (
        index < 0 ||
        index >= journey.length
    ) {
        return;
    }


    $$(".journey-node").forEach(
        (node) => {

            node.classList.toggle(
                "active",
                Number(
                    node.dataset.step
                ) <= index
            );
        }
    );


    const progress =
        $("#progressLine");

    if (progress) {

        progress.style.width =
            `${(
                index /
                (journey.length - 1)
            ) * 100}%`;
    }


    const data =
        journey[index];

    const info =
        $("#journeyInfo");

    if (!info) return;


    info.innerHTML = `
        <div class="big-icon">
            ${data.icon}
        </div>

        <div>
            <p class="kicker">
                ${data.role}
            </p>

            <h3>
                ${data.title}
            </h3>

            <p>
                ${data.description}
            </p>
        </div>

        <span class="status">
            ${data.status}
        </span>
    `;
}


$$(".journey-node").forEach(
    (node) => {

        node.addEventListener(
            "click",
            () => {

                setJourney(
                    Number(
                        node.dataset.step
                    )
                );
            }
        );
    }
);


setJourney(0);


// ============================================================
// ROLE FLOWS
// ============================================================

const roles = {

    customer: {

        icon: "🛒",

        mini:
            "CUSTOMER APP",

        kicker:
            "CUSTOMER FLOW",

        title:
            "Find it. Filter it. Order it.",

        description:
            "The customer journey stays simple, from discovering nearby products to tracking the order.",

        steps: [
            "Browse categories & products",
            "Filter by what you need",
            "Add to cart & checkout",
            "Track the order"
        ]
    },


    shop: {

        icon: "🏪",

        mini:
            "SHOP APP",

        kicker:
            "SHOP OWNER FLOW",

        title:
            "Receive. Prepare. Ready.",

        description:
            "The shop owner gets the order, prepares the items and marks it ready for the delivery partner.",

        steps: [
            "Receive new order",
            "Review & prepare items",
            "Mark order ready",
            "Hand over for pickup"
        ]
    },


    delivery: {

        icon: "🛵",

        mini:
            "DELIVERY APP",

        kicker:
            "DELIVERY BOY FLOW",

        title:
            "Accept. Pick up. Deliver.",

        description:
            "The delivery partner sees ready orders, accepts one, completes pickup verification and delivers it.",

        steps: [
            "See ready orders",
            "Accept a delivery",
            "Pickup verification",
            "Deliver to customer"
        ]
    }
};


function setRole(role) {

    const data =
        roles[role];

    if (!data) return;


    const object =
        $("#roleObject");

    const mini =
        $("#roleMini");

    const kicker =
        $("#roleKicker");

    const title =
        $("#roleTitle");

    const desc =
        $("#roleDesc");

    const steps =
        $("#roleSteps");


    if (object) {
        object.textContent =
            data.icon;
    }


    if (mini) {
        mini.textContent =
            data.mini;
    }


    if (kicker) {
        kicker.textContent =
            data.kicker;
    }


    if (title) {
        title.textContent =
            data.title;
    }


    if (desc) {
        desc.textContent =
            data.description;
    }


    if (steps) {

        steps.innerHTML =
            data.steps
                .map(
                    (step, i) => `
                        <div class="step">
                            <i>
                                ${String(i + 1).padStart(2, "0")}
                            </i>
                            ${step}
                        </div>
                    `
                )
                .join("");
    }


    $$("[data-role]").forEach(
        (button) => {

            button.classList.toggle(
                "selected",
                button.dataset.role === role
            );
        }
    );
}


$$("[data-role]").forEach(
    (button) => {

        button.addEventListener(
            "click",
            () => {

                setRole(
                    button.dataset.role
                );
            }
        );
    }
);


setRole("customer");


// ============================================================
// PRODUCTS
// ============================================================

const products = [

    [
        "🥦",
        "Fresh vegetables",
        "Vegetable"
    ],

    [
        "🍎",
        "Fresh fruits",
        "Grocery"
    ],

    [
        "🛍️",
        "Daily groceries",
        "Grocery"
    ],

    [
        "🐶",
        "Pet food",
        "Pet"
    ],

    [
        "🍼",
        "Baby care",
        "Baby"
    ],

    [
        "🥛",
        "Daily dairy",
        "Grocery"
    ],

    [
        "🥕",
        "Local vegetables",
        "Vegetable"
    ],

    [
        "🐾",
        "Pet essentials",
        "Pet"
    ]
];


let activeFilter = "all";

let searchQuery = "";


function renderProducts() {

    const container =
        $("#products");

    if (!container) {
        return;
    }


    const filtered =
        products.filter(
            (product) => {

                const category =
                    activeFilter === "all" ||
                    product[2] === activeFilter;


                const search =
                    product[1]
                        .toLowerCase()
                        .includes(
                            searchQuery
                                .toLowerCase()
                        );


                return (
                    category &&
                    search
                );
            }
        );


    container.innerHTML =
        filtered
            .map(
                (product) => `
                    <article class="product-card">

                        <span class="emoji">
                            ${product[0]}
                        </span>

                        <b>
                            ${product[1]}
                        </b>

                        <small>
                            ${product[2]}
                        </small>

                    </article>
                `
            )
            .join("");


    const result =
        $("#result");


    if (result) {

        result.textContent =
            `${filtered.length} result${
                filtered.length === 1
                    ? ""
                    : "s"
            } shown`;
    }
}


$$("[data-filter]").forEach(
    (button) => {

        button.addEventListener(
            "click",
            () => {

                activeFilter =
                    button.dataset.filter;


                $$("[data-filter]")
                    .forEach(
                        (item) => {

                            item.classList.toggle(
                                "on",
                                item === button
                            );
                        }
                    );


                renderProducts();
            }
        );
    }
);


const search =
    $("#search");


if (search) {

    search.addEventListener(
        "input",
        (e) => {

            searchQuery =
                e.target.value.trim();

            renderProducts();
        }
    );
}


renderProducts();


// ============================================================
// YEAR
// ============================================================

const year =
    $("#year");

if (year) {

    year.textContent =
        new Date().getFullYear();
}


// ============================================================
// REDUCED MOTION
// ============================================================

if (
    window.matchMedia &&
    window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches
) {

    document.body.classList.add(
        "reduced"
    );
}