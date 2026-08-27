const PRODUCTS = [
  {
    id: 1,
    name: "كان لك معايا",
    desc: "Exploring repetition and rhythm through Arabic letterforms and visual structure.",
    image: "assets/artwork-1.jpg",
    thumb: "assets/collection-1.jpg"
  },
  {
    id: 2,
    name: "عمّان",
    desc: "A geometric study of Arabic type inspired by the visual character of Amman.",
    image: "assets/artwork-2.jpg",
    thumb: "assets/collection-2.jpg"
  },
  {
    id: 3,
    name: "الدار أمان",
    desc: "Exploring Arabic letterforms through contrast, proportion, and geometric rhythm.",
    image: "assets/artwork-3.jpg",
    thumb: "assets/collection-3.jpg"
  },
  {
    id: 4,
    name: "سعادة الريس",
    desc: "A bold typographic composition exploring rhythm, scale, and expressive Arabic forms.",
    image: "assets/artwork-4.jpg",
    thumb: "assets/collection-4.jpg"
  },
  {
    id: 5,
    name: "الجمال",
    desc: "A bold interpretation of Arabic typography reduced to its essential geometric forms.",
    image: "assets/artwork-5.jpg",
    thumb: "assets/collection-5.jpg"
  },
  {
    id: 6,
    name: "صبر أيوب",
    desc: "A study of Arabic typography through structure, movement, and layered forms.",
    image: "assets/artwork-6.jpg",
    thumb: "assets/collection-6.jpg"
  },
  {
    id: 7,
    name: "العودة",
    desc: "A minimal exploration of Arabic type through balance, weight, and negative space.",
    image: "assets/artwork-7.jpg",
    thumb: "assets/collection-7.jpg"
  },
  {
    id: 8,
    name: "فراغ",
    desc: "An exploration of Arabic type and negative space through circular forms and repetition.",
    image: "assets/artwork-8.jpg",
    thumb: "assets/collection-8.jpg"
  }
];

const A3 = 18;
const A1 = 28;
const DELIVERY = 3;

const EMAILJS_SERVICE_ID = "service_80wx90b";
const EMAILJS_TEMPLATE_ID = "template_winvnqw";

let cart = JSON.parse(localStorage.getItem("frameco-cart") || "[]");

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

function money(number) {
  return `${number} JD`;
}

function save() {
  localStorage.setItem("frameco-cart", JSON.stringify(cart));
  renderCart();
}

/* =========================
   COLLECTION
========================= */

function renderCollection() {
  const grid = $("#collection-grid");

  if (!grid) return;

  grid.innerHTML = PRODUCTS.map(
    (p) => `
      <article class="product-card" data-id="${p.id}">
        <div class="product-image">
          <img src="${p.thumb}" alt="${p.name}">
        </div>

        <div class="product-meta">
          <span>${p.name}</span>
          <span>FROM ${A3} JD</span>
        </div>
      </article>
    `
  ).join("");

  $$(".product-card").forEach((card) => {
    card.addEventListener("click", () => {
      openProduct(Number(card.dataset.id));
    });
  });
}

/* =========================
   PRODUCT
========================= */

function openProduct(id) {
  const product = PRODUCTS.find((item) => item.id === id);

  if (!product) return;

  $("#product-modal").innerHTML = `
    <div class="product-modal-inner">

      <button class="close" data-close>×</button>

      <div class="product-detail">

        <div class="detail-copy">

          <div class="eyebrow">
            PRODUCT | ARTWORK PAGE
          </div>

          <h2>${product.name}</h2>

          <p>${product.desc}</p>

          <div class="size-label">
            Size
          </div>

          <div class="sizes">

            <button
              class="size active"
              data-size="A3"
            >
              A3
              <span>29.7 × 42 cm</span>
              <strong>${A3} JD</strong>
            </button>

            <button
              class="size"
              data-size="A1"
            >
              A1
              <span>59.4 × 84.1 cm</span>
              <strong>${A1} JD</strong>
            </button>

          </div>

          <button
            class="primary add"
            data-add="${product.id}"
          >
            ADD TO CART
          </button>

        </div>

        <div class="detail-image">
          <img src="${product.image}" alt="${product.name}">
        </div>

      </div>

    </div>
  `;

  $("#product-modal").classList.add("active");

  const closeButton = $("[data-close]");

  if (closeButton) {
    closeButton.onclick = () => {
      $("#product-modal").classList.remove("active");
    };
  }

  $$(".size").forEach((button) => {
    button.onclick = () => {
      $$(".size").forEach((item) => {
        item.classList.remove("active");
      });

      button.classList.add("active");
    };
  });

  const addButton = $(".add");

  if (addButton) {
    addButton.onclick = () => {
      const selectedSize = $(".size.active").dataset.size;

      addToCart(id, selectedSize);

      $("#product-modal").classList.remove("active");

      openCart();
    };
  }
}

/* =========================
   CART
========================= */

function addToCart(id, size) {
  const existing = cart.find(
    (item) => item.id === id && item.size === size
  );

  if (existing) {
    existing.qty++;
  } else {
    cart.push({
      id,
      size,
      qty: 1
    });
  }

  save();
}

function removeItem(id, size) {
  cart = cart.filter(
    (item) => !(item.id === id && item.size === size)
  );

  save();
}

function renderCart() {
  const count = cart.reduce(
    (sum, item) => sum + item.qty,
    0
  );

  const cartCount = $("#cart-count");

  if (cartCount) {
    cartCount.textContent = count;
  }

  const drawerCount = $("#drawer-cart-count");

  if (drawerCount) {
    drawerCount.textContent = count;
  }

  const cartItems = $("#cart-items");

  if (cartItems) {
    cartItems.innerHTML = cart.length
      ? cart
          .map((item) => {
            const product = PRODUCTS.find(
              (p) => p.id === item.id
            );

            const price =
              item.size === "A1"
                ? A1
                : A3;

            return `
              <div class="cart-item">

                <img
                  src="${product.thumb}"
                  alt="${product.name}"
                >

                <div>

                  <strong>
                    ${product.name}
                  </strong>

                  <span>
                    ${item.size} — ${money(price)}
                  </span>

                  <span>
                    Qty: ${item.qty}
                  </span>

                  <button
                    class="remove"
                    data-id="${item.id}"
                    data-size="${item.size}"
                  >
                    REMOVE
                  </button>

                </div>

                <b>
                  ${money(price * item.qty)}
                </b>

              </div>
            `;
          })
          .join("")
      : `<p class="empty">Your cart is empty.</p>`;
  }

  $$(".remove").forEach((button) => {
    button.onclick = () => {
      removeItem(
        Number(button.dataset.id),
        button.dataset.size
      );
    };
  });

  const subtotal = cart.reduce(
    (sum, item) =>
      sum +
      (item.size === "A1" ? A1 : A3) *
        item.qty,
    0
  );

  const total = cart.length
    ? subtotal + DELIVERY
    : 0;

  if ($("#subtotal")) {
    $("#subtotal").textContent = money(subtotal);
  }

  if ($("#total")) {
    $("#total").textContent = money(total);
  }

  if ($("#checkout-total")) {
    $("#checkout-total").textContent = money(total);
  }

  if ($("#checkout-total-button")) {
    $("#checkout-total-button").textContent =
      money(total);
  }
}

function openCart() {
  if ($("#cart")) {
    $("#cart").classList.add("active");
  }
}

function closeCart() {
  if ($("#cart")) {
    $("#cart").classList.remove("active");
  }
}

/* =========================
   CHECKOUT
========================= */

function openCheckout() {
  if (!cart.length) return;

  closeCart();

  const checkoutItems = $("#checkout-items");

  if (checkoutItems) {
    checkoutItems.innerHTML = cart
      .map((item) => {
        const product = PRODUCTS.find(
          (p) => p.id === item.id
        );

        const price =
          item.size === "A1"
            ? A1
            : A3;

        return `
          <div class="checkout-line">

            <span>
              ${product.name}
              ·
              ${item.size}
              ×
              ${item.qty}
            </span>

            <b>
              ${money(price * item.qty)}
            </b>

          </div>
        `;
      })
      .join("");
  }

  $("#checkout").classList.add("active");
}

function closeCheckout() {
  if ($("#checkout")) {
    $("#checkout").classList.remove("active");
  }
}

/* =========================
   GET CHECKOUT DETAILS
========================= */

function getField(form, names) {
  for (const name of names) {
    const field =
      form.querySelector(`[name="${name}"]`) ||
      form.querySelector(`#${name}`);

    if (field && field.value) {
      return field.value.trim();
    }
  }

  return "";
}

/* =========================
   BUILD ORDER ITEMS
========================= */

function getOrderItems() {
  return cart
    .map((item) => {
      const product = PRODUCTS.find(
        (p) => p.id === item.id
      );

      const price =
        item.size === "A1"
          ? A1
          : A3;

      return `${product.name} — ${item.size} × ${item.qty} — ${money(
        price * item.qty
      )}`;
    })
    .join("\n");
}

/* =========================
   SEND EMAIL
========================= */

async function sendOrderEmail(
  orderNumber,
  form
) {
  if (
    typeof emailjs === "undefined"
  ) {
    throw new Error(
      "EmailJS is not loaded."
    );
  }

  const customerName = getField(form, [
    "customer_name",
    "name",
    "full_name"
  ]);

  const customerEmail = getField(form, [
    "customer_email",
    "email"
  ]);

  const customerPhone = getField(form, [
    "customer_phone",
    "phone",
    "telephone"
  ]);

  const customerAddress = getField(form, [
    "customer_address",
    "address"
  ]);

  const subtotal = cart.reduce(
    (sum, item) =>
      sum +
      (item.size === "A1" ? A1 : A3) *
        item.qty,
    0
  );

  const total = subtotal + DELIVERY;

  const templateParams = {
    order_number: orderNumber,

    customer_name:
      customerName || "Not provided",

    customer_email:
      customerEmail || "Not provided",

    customer_phone:
      customerPhone || "Not provided",

    customer_address:
      customerAddress || "Not provided",

    order_items:
      getOrderItems(),

    subtotal: money(subtotal),

    delivery: money(DELIVERY),

    total: money(total),

    reply_to:
      customerEmail || ""
  };

  console.log(
    "Sending order email:",
    templateParams
  );

  return emailjs.send(
    EMAILJS_SERVICE_ID,
    EMAILJS_TEMPLATE_ID,
    templateParams
  );
}

/* =========================
   PLACE ORDER
========================= */

async function placeOrder(event) {
  event.preventDefault();

  if (!cart.length) {
    return;
  }

  const form = event.target;

  const orderNumber =
    "#" +
    String(
      Math.floor(
        10000 +
          Math.random() * 90000
      )
    );

  const subtotal = cart.reduce(
    (sum, item) =>
      sum +
      (item.size === "A1" ? A1 : A3) *
        item.qty,
    0
  );

  const total =
    subtotal + DELIVERY;

  /*
   * Disable submit button while sending.
   */

  const submitButton =
    form.querySelector(
      'button[type="submit"], input[type="submit"]'
    );

  const originalText =
    submitButton
      ? submitButton.textContent
      : "";

  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent =
      "PROCESSING...";
  }

  try {
    /*
     * SEND EMAIL FIRST
     */

    await sendOrderEmail(
      orderNumber,
      form
    );

    /*
     * Email successfully sent.
     * Continue to payment screen.
     */

    if ($("#order-number")) {
      $("#order-number").textContent =
        orderNumber;
    }

    if ($("#payment-total")) {
      $("#payment-total").textContent =
        money(total).replace(
          " JD",
          " JOD"
        );
    }

    if ($("#payment-reference")) {
      $("#payment-reference").textContent =
        `ORDER ${orderNumber}`;
    }

    closeCheckout();

    if ($("#payment")) {
      $("#payment").classList.add(
        "active"
      );
    }

  } catch (error) {
    console.error(
      "EmailJS error:",
      error
    );

    alert(
      "We couldn't send your order. Please check your details and try again."
    );

    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent =
        originalText || "PLACE ORDER";
    }

    return;
  }

  if (submitButton) {
    submitButton.disabled = false;
    submitButton.textContent =
      originalText || "PLACE ORDER";
  }
}

/* =========================
   PAYMENT
========================= */

function completePayment() {
  cart = [];

  save();

  if ($("#payment")) {
    $("#payment").classList.remove(
      "active"
    );
  }

  if ($("#success")) {
    $("#success").classList.add(
      "active"
    );
  }
}

/* =========================
   CLOSE OVERLAYS
========================= */

function closeOverlay(id) {
  const element = $(id);

  if (element) {
    element.classList.remove(
      "active"
    );
  }
}

/* =========================
   INITIALIZE
========================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {
    renderCollection();

    renderCart();

    /* CART */

    const cartOpen = $("#cart-open");

    if (cartOpen) {
      cartOpen.onclick = openCart;
    }

    const cartClose = $("#cart-close");

    if (cartClose) {
      cartClose.onclick = closeCart;
    }

    /* CHECKOUT */

    const checkoutOpen =
      $("#checkout-open");

    if (checkoutOpen) {
      checkoutOpen.onclick =
        openCheckout;
    }

    const checkoutClose =
      $("#checkout-close");

    if (checkoutClose) {
      checkoutClose.onclick =
        closeCheckout;
    }

    const checkoutForm =
      $("#checkout-form");

    if (checkoutForm) {
      checkoutForm.addEventListener(
        "submit",
        placeOrder
      );
    }

    /* PAYMENT */

    const paymentDone =
      $("#payment-done");

    if (paymentDone) {
      paymentDone.onclick =
        completePayment;
    }

    /* CLIQ COPY */

    const copyButton =
      $(".cliq-box button");

    if (copyButton) {
      copyButton.onclick = () => {
        if (
          navigator.clipboard
        ) {
          navigator.clipboard.writeText(
            "FRAMECOST"
          );
        }
      };
    }

    /* SUCCESS */

    const successClose =
      $("#success-close");

    if (successClose) {
      successClose.onclick = () =>
        closeOverlay(
          "#success"
        );
    }

    /* PRODUCT MODAL */

    const productModal =
      $("#product-modal");

    if (productModal) {
      productModal.addEventListener(
        "click",
        (event) => {
          if (
            event.target.id ===
            "product-modal"
          ) {
            closeOverlay(
              "#product-modal"
            );
          }
        }
      );
    }

    /* MOBILE MENU */

    const menu = $("#menu");

    if (menu) {
      menu.onclick = () => {
        document.body.classList.toggle(
          "nav-open"
        );
      };
    }
  }
);
