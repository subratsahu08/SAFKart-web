const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];


// MOBILE NAV

const menu = $("#menu");
const nav = $("#nav");

if (menu && nav) {
    menu.addEventListener("click", () => {
        const open = nav.classList.toggle("open");
        menu.setAttribute("aria-expanded", open);

        if (open) {
            menu.setAttribute("aria-label", "Close navigation");
        } else {
            menu.setAttribute("aria-label", "Open navigation");
        }
    });

    $$("nav a").forEach((link) => {
        link.addEventListener("click", () => {
            nav.classList.remove("open");
            menu.setAttribute("aria-expanded", "false");
            menu.setAttribute("aria-label", "Open navigation");
        });
    });
}


// 3D DELIVERY ANIMATION

const scene = $("#hero3d");
const rider = $("#deliveryRider");
const box = $("#deliveryBox");
const payment = $("#payment");
const handover = $("#handover");
const status = $("#deliveryStatus");

let animationStart = performance.now();

const animationDuration = 14000;

function easeInOut(t) {
    return t < 0.5
        ? 2 * t * t
        : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function setPosition(x, y, rotation) {
    if (!rider) return;

    rider.style.left = `${x}%`;
    rider.style.top = `${y}%`;

    rider.style.transform =
        `translate(-50%, -50%) rotate(${rotation}deg)`;
}

function hideEffects() {
    if (payment) {
        payment.classList.remove("show");
    }

    if (handover) {
        handover.classList.remove("show");
    }
}

function animateDelivery(time) {
    const elapsed =
        (time - animationStart) % animationDuration;

    const progress =
        elapsed / animationDuration;

    let x = 8;
    let y = 63;
    let rotation = 0;

    hideEffects();

    if (progress < 0.22) {
        const p = easeInOut(progress / 0.22);

        x = 8 + (39 - 8) * p;
        y = 63 + (29 - 63) * p;

        rotation = 8;

        if (status) {
            status.textContent = "RIDING TO SHOP";
        }

        if (box) {
            box.style.opacity = "0";
            box.style.transform =
                "translateZ(45px) rotateX(8deg) rotateY(-12deg)";
        }
    }

    else if (progress < 0.32) {
        const p =
            (progress - 0.22) / 0.10;

        x = 39;
        y = 29;

        rotation =
            Math.sin(p * Math.PI * 2) * 2;

        if (status) {
            status.textContent =
                p < 0.55
                    ? "PICKING UP ORDER"
                    : "ORDER PICKED UP";
        }

        if (box) {
            box.style.opacity =
                p < 0.55 ? "0" : "1";

            box.style.transform =
                `translateZ(45px)
                 rotateX(${8 + p * 4}deg)
                 rotateY(${-12 + p * 5}deg)`;
        }
    }

    else if (progress < 0.68) {
        const p =
            easeInOut(
                (progress - 0.32) / 0.36
            );

        x = 39 + (86 - 39) * p;
        y = 29 + (46 - 29) * p;

        rotation = 8;

        if (status) {
            status.textContent =
                "DELIVERING ORDER";
        }

        if (box) {
            box.style.opacity = "1";
            box.style.transform =
                "translateZ(45px) rotateX(8deg) rotateY(-12deg)";
        }
    }

    else if (progress < 0.78) {
        const p =
            (progress - 0.68) / 0.10;

        x = 86;
        y = 46;

        rotation =
            Math.sin(p * Math.PI * 4) * 2;

        if (status) {
            status.textContent =
                p < 0.45
                    ? "HANDING OVER ORDER"
                    : "PAYMENT RECEIVED";
        }

        if (box) {
            box.style.opacity =
                p < 0.45 ? "1" : "0";

            box.style.transform =
                `translateZ(45px)
                 scale(${p < 0.45 ? 1 : 0.7})
                 rotateX(8deg)
                 rotateY(-12deg)`;
        }

        if (handover && p < 0.45) {
            handover.classList.add("show");
        }

        if (payment && p >= 0.45) {
            payment.classList.add("show");
        }
    }

    else {
        const p =
            easeInOut(
                (progress - 0.78) / 0.22
            );

        x = 86 + (8 - 86) * p;
        y = 46 + (63 - 46) * p;

        rotation = -8;

        if (status) {
            status.textContent =
                "RETURNING HOME";
        }

        if (box) {
            box.style.opacity = "0";
            box.style.transform =
                "translateZ(45px) rotateX(8deg) rotateY(-12deg)";
        }
    }

    setPosition(x, y, rotation);

    requestAnimationFrame(animateDelivery);
}

if (rider) {
    requestAnimationFrame(animateDelivery);
}


// SUBTLE 3D SCENE MOVEMENT

if (scene) {
    let sceneX = 0;
    let sceneY = 0;
    let targetSceneX = 0;
    let targetSceneY = 0;

    scene.addEventListener("pointermove", (event) => {
        const rect =
            scene.getBoundingClientRect();

        const x =
            (event.clientX - rect.left) /
            rect.width - 0.5;

        const y =
            (event.clientY - rect.top) /
            rect.height - 0.5;

        targetSceneX = x * 5;
        targetSceneY = y * -4;
    });

    scene.addEventListener("pointerleave", () => {
        targetSceneX = 0;
        targetSceneY = 0;
    });

    function animateScene() {
        sceneX +=
            (targetSceneX - sceneX) * 0.04;

        sceneY +=
            (targetSceneY - sceneY) * 0.04;

        scene.style.transform =
            `rotateX(${sceneY}deg) rotateY(${sceneX}deg)`;

        requestAnimationFrame(animateScene);
    }

    animateScene();
}


// ORDER JOURNEY

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
    if (index < 0 || index >= journey.length) return;

    $$(".journey-node").forEach((node) => {
        node.classList.toggle(
            "active",
            Number(node.dataset.step) <= index
        );
    });

    const progress = $("#progressLine");

    if (progress) {
        progress.style.width =
            `${(index / (journey.length - 1)) * 100}%`;
    }

    const data = journey[index];
    const info = $("#journeyInfo");

    if (!info) return;

    info.innerHTML = `
        <div class="big-icon">${data.icon}</div>
        <div>
            <p class="kicker">${data.role}</p>
            <h3>${data.title}</h3>
            <p>${data.description}</p>
        </div>
        <span class="status">${data.status}</span>
    `;
}

$$(".journey-node").forEach((node) => {
    node.addEventListener("click", () => {
        setJourney(Number(node.dataset.step));
    });
});

setJourney(0);


// ROLE FLOWS

const roles = {
    customer: {
        icon: "🛒",
        mini: "CUSTOMER APP",
        kicker: "CUSTOMER FLOW",
        title: "Find it. Filter it. Order it.",
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
        mini: "SHOP APP",
        kicker: "SHOP OWNER FLOW",
        title: "Receive. Prepare. Ready.",
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
        mini: "DELIVERY APP",
        kicker: "DELIVERY BOY FLOW",
        title: "Accept. Pick up. Deliver.",
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
    const data = roles[role];

    if (!data) return;

    const object = $("#roleObject");
    const mini = $("#roleMini");
    const kicker = $("#roleKicker");
    const title = $("#roleTitle");
    const desc = $("#roleDesc");
    const steps = $("#roleSteps");

    if (object) {
        object.textContent = data.icon;
    }

    if (mini) {
        mini.textContent = data.mini;
    }

    if (kicker) {
        kicker.textContent = data.kicker;
    }

    if (title) {
        title.textContent = data.title;
    }

    if (desc) {
        desc.textContent = data.description;
    }

    if (steps) {
        steps.innerHTML = data.steps
            .map((step, i) => `
                <div class="step">
                    <i>${String(i + 1).padStart(2, "0")}</i>
                    ${step}
                </div>
            `)
            .join("");
    }

    $$("[data-role]").forEach((button) => {
        button.classList.toggle(
            "selected",
            button.dataset.role === role
        );
    });
}

$$("[data-role]").forEach((button) => {
    button.addEventListener("click", () => {
        setRole(button.dataset.role);
    });
});

setRole("customer");


// PRODUCTS

const products = [
    ["🥦", "Fresh vegetables", "Vegetable"],
    ["🍎", "Fresh fruits", "Grocery"],
    ["🛍️", "Daily groceries", "Grocery"],
    ["🐶", "Pet food", "Pet"],
    ["🍼", "Baby care", "Baby"],
    ["🥛", "Daily dairy", "Grocery"],
    ["🥕", "Local vegetables", "Vegetable"],
    ["🐾", "Pet essentials", "Pet"]
];

let activeFilter = "all";
let searchQuery = "";

function renderProducts() {
    const container = $("#products");

    if (!container) return;

    const filtered = products.filter((product) => {
        const category =
            activeFilter === "all" ||
            product[2] === activeFilter;

        const search =
            product[1]
                .toLowerCase()
                .includes(
                    searchQuery.toLowerCase()
                );

        return category && search;
    });

    container.innerHTML = filtered
        .map((product) => `
            <article class="product-card">
                <span class="emoji">${product[0]}</span>
                <b>${product[1]}</b>
                <small>${product[2]}</small>
            </article>
        `)
        .join("");

    const result = $("#result");

    if (result) {
        result.textContent =
            `${filtered.length} result${filtered.length === 1 ? "" : "s"} shown`;
    }
}

$$("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
        activeFilter = button.dataset.filter;

        $$("[data-filter]").forEach((item) => {
            item.classList.toggle(
                "on",
                item === button
            );
        });

        renderProducts();
    });
});

const search = $("#search");

if (search) {
    search.addEventListener("input", (e) => {
        searchQuery =
            e.target.value.trim();

        renderProducts();
    });
}

renderProducts();


// YEAR

const year = $("#year");

if (year) {
    year.textContent =
        new Date().getFullYear();
}


// REDUCED MOTION

if (
    window.matchMedia &&
    window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches
) {
    document.body.classList.add("reduced");
}