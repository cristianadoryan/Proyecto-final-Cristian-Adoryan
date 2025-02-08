  import { getCartItems, loadCartFromLocalStorage } from "./cart.js";


  document.getElementById("titulo-container").innerHTML = "<h1>Best Sellers</h1>";

  document.addEventListener("DOMContentLoaded", () => {
    loadCartFromLocalStorage(); 
    fetchProducts(); 
    updateCartUi(); 
  });

  const fetchProducts = () => {
    fetch('./products.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al cargar los productos');
        }
        return response.json(); 
      })
      .then((products) => {
        if (!Array.isArray(products)) {
          throw new Error('El formato de los datos no es válido');
        }
        renderProducts(products); 
      })
      .catch((error) => {
        console.error('Hubo un problema con la carga de productos:', error);
      });
  };

  export const renderProducts = (products) => {
    const productList = document.getElementById("productList");
    productList.innerHTML = "";

    const cartItems = getCartItems(); 

    products.forEach((product) => {
      const productCard = document.createElement("article");
      productCard.classList.add("product");
      productCard.setAttribute("data-id", product.id);

      const isInCart = cartItems.some((item) => item.id === product.id);

      productCard.innerHTML = `
        <div>
          <img class="productImage" src="${product.image}" alt="${product.title}" />
        </div>  
        <div>
          <h5 class="productTitle">${product.title}</h5>
          <p class="productPrice">$${product.price}</p>
        </div>
        <button class="productAdd" ${
          isInCart ? "disabled" : ""
        }>${isInCart ? "En el carrito" : "Agregar"}</button>
      `;

      productList.append(productCard);
    });
  };

  export const searchProduct = async (productName) => {
    try {
      const response = await fetch("../products.json");
      const products = await response.json(); 

      const product = products.find(item => item.title.toLowerCase().includes(productName.toLowerCase()));

      if (product) {
        Swal.fire({
          title: `Producto encontrado: ${product.title}`,
          text: `Precio: $${product.price}`,
          imageUrl: product.image,
          imageWidth: 200,
          imageHeight: 200,
          imageAlt: product.title,
          icon: "success",
          confirmButtonText: "Ok"
        });
      } else {
        Swal.fire({
          title: "Producto no encontrado",
          text: "Lo sentimos, este producto no está disponible.",
          icon: "error",
          confirmButtonText: "Cerrar"
        });
      }
    } catch (error) {
      console.error("Error al cargar los productos:", error);
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al cargar los productos.",
        icon: "error",
        confirmButtonText: "Cerrar"
      });
    }
  };

  export const setupSearchButton = () => {
    document.querySelector(".searchButton").addEventListener("click", () => {
      const productName = document.querySelector(".searchInput").value;
      searchProduct(productName);
    });
  };

  export const updateCartUi = () => {
    const cartContainer = document.querySelector(".cartItems");
    const cartTotalPrice = document.querySelector(".cartTotalPrice");
    const productList = document.querySelectorAll(".productAdd");

    const cartItemsList = getCartItems(); 

    // Limpiar interfaz del carrito
    cartContainer.innerHTML = "";

    // Mostrar los productos en el carrito
    cartItemsList.forEach((item) => {
      const cartItem = document.createElement("div");
      cartItem.classList.add("cartItem");
      cartItem.setAttribute("data-id", item.id);

      cartItem.innerHTML = `
        <div class="cartItem-title">${item.title}</div>
        <div>${item.price}</div>
        <div>
          <span>Cantidad: ${item.quantity}</span>
          <button class="cartIncrease">+</button>
          <button class="cartDecrease">-</button>
          <button class="cartRemove">Eliminar</button>
        </div>
      `;

      cartContainer.appendChild(cartItem);
    });

    // Calcular  total
    const total = cartItemsList.reduce((sum, product) => {
      const price = parseFloat(product.price.replace("$", ""));
      return sum + price * product.quantity;
    }, 0);
    cartTotalPrice.innerHTML = `Total: $${total.toFixed(2)}`;

    // cambiar boton "Agregar"
    productList.forEach((button) => {
      const productId = button.closest(".product").getAttribute("data-id");
      const isInCart = cartItemsList.some((item) => item.id === productId);

      button.disabled = isInCart;
      button.textContent = isInCart ? "En el carrito" : "Agregar";
    });
  };

  // eliminar producto
  document.querySelector(".cartItems").addEventListener("click", (event) => {
    if (event.target.classList.contains("cartRemove")) {
      const productId = event.target.closest(".cartItem").getAttribute("data-id");
      updateCartUi(); 
    }
  });

