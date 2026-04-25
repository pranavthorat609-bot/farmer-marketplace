import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
import { getDatabase, ref, push, onValue, update } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyChfDMUJdxgO0ffUcmv4P_NGWwvHRumMIg",
  authDomain: "farmer-marketplace-4642f.firebaseapp.com",
  databaseURL: "https://farmer-marketplace-4642f-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "farmer-marketplace-4642f",
  storageBucket: "farmer-marketplace-4642f.appspot.com",
  messagingSenderId: "582588803982",
  appId: "1:582588803982:web:105b340c250b07b20c12df"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// 🔹 ADD PRODUCT
window.addProduct = function () {
  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;

  if (!name || !price) {
    alert("Enter product details");
    return;
  }

  push(ref(db, "products"), {
    name,
    price
  });

  alert("Product Added!");
};

// 🔹 SHOW PRODUCTS
const productContainer = document.getElementById("products");

if (productContainer) {
  onValue(ref(db, "products"), (snapshot) => {
    const data = snapshot.val();
    productContainer.innerHTML = "";

    if (!data) {
      productContainer.innerHTML = "<p>No products available</p>";
      return;
    }

    for (let id in data) {
      const p = data[id];

      productContainer.innerHTML += `
        <div class="bg-white p-4 rounded-xl shadow">
          <h2 class="text-lg font-semibold">${p.name}</h2>
          <p class="text-green-600 font-bold mb-2">₹${p.price}</p>

          <button onclick="buyProduct('${p.name}','${p.price}')"
            class="w-full bg-blue-600 text-white py-2 rounded-lg">
            Buy Now
          </button>
        </div>
      `;
    }
  });
}

// 🔹 BUY PRODUCT
window.buyProduct = function (name, price) {
  push(ref(db, "orders"), {
    productName: name,
    price,
    status: "pending"
  });

  alert("Order Placed!");
};

// 🔹 SELLER ORDERS
const orderContainer = document.getElementById("orders");

if (orderContainer) {
  onValue(ref(db, "orders"), (snapshot) => {
    const data = snapshot.val();
    orderContainer.innerHTML = "";

    if (!data) {
      orderContainer.innerHTML = "<p>No orders yet</p>";
      return;
    }

    for (let id in data) {
      const o = data[id];

      orderContainer.innerHTML += `
        <div class="bg-yellow-100 p-4 rounded-lg shadow">
          <h2 class="font-bold">${o.productName}</h2>
          <p>₹${o.price}</p>
          <p>Status: ${o.status}</p>

          <button onclick="acceptOrder('${id}')"
            class="bg-green-600 text-white px-3 py-1 m-1 rounded">
            Accept
          </button>

          <button onclick="rejectOrder('${id}')"
            class="bg-red-600 text-white px-3 py-1 m-1 rounded">
            Reject
          </button>
        </div>
      `;
    }
  });
}

// 🔹 ACCEPT / REJECT
window.acceptOrder = function (id) {
  update(ref(db, "orders/" + id), { status: "accepted" });
};

window.rejectOrder = function (id) {
  update(ref(db, "orders/" + id), { status: "rejected" });
};

// 🔹 BUYER ORDERS
const buyerOrders = document.getElementById("buyerOrders");

if (buyerOrders) {
  onValue(ref(db, "orders"), (snapshot) => {
    const data = snapshot.val();
    buyerOrders.innerHTML = "";

    if (!data) {
      buyerOrders.innerHTML = "<p>No orders placed</p>";
      return;
    }

    for (let id in data) {
      const o = data[id];

      buyerOrders.innerHTML += `
        <div class="bg-gray-100 p-3 rounded-lg shadow">
          <h2 class="font-bold">${o.productName}</h2>
          <p>₹${o.price}</p>
          <p>Status: <b>${o.status}</b></p>
        </div>
      `;
    }
  });
}