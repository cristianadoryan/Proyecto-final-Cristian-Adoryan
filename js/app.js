import { addToCart, createProduct, removeFromCart, clearCart, buyCart  } from "./cart.js";
import { renderProducts, updateCartUi } from "./ui.js";
import { setupSearchButton } from "./ui.js";

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  updateCartUi();
});

//BOTON DE BUSQUEDA DE PERFUMES
document.querySelector(".searchButton").addEventListener("click",() => {
  setupSearchButton();
 })
//FIN DE BOTON DE BUSQUEDA DE PERFUMES

// boton Sidebar
const cartOpenButton = document.querySelector(".cartOpenButton");
const cartSidebar = document.querySelector(".cartSidebar");
const cartCloseButton = document.querySelector(".cartClose");

cartOpenButton.addEventListener("click", () => {
  cartSidebar.classList.add("cartSidebar--open");
  cartOpenButton.classList.add("hidden");
});

cartCloseButton.addEventListener("click", () => {
  cartSidebar.classList.remove("cartSidebar--open");
  cartOpenButton.classList.remove("hidden");
});

// Botón para vaciar 
document.querySelector(".cartClear").addEventListener("click", () => {
  clearCart(); 
  updateCartUi(); 
});

//boton para comprar
document.querySelector(".cartBuy").addEventListener("click",() => {
 buyCart();
})

// Manejo de la adición de productos al carrito
document.getElementById("productList").addEventListener("click", (event) => {
  if (event.target.classList.contains("productAdd")) {
    const card = event.target.closest(".product");
    const productTitle = card.querySelector(".productTitle").innerText;
    const productPrice = card.querySelector(".productPrice").innerText;
    const productId = card.getAttribute("data-id");

    const product = createProduct(productId, productTitle, productPrice);

    addToCart(product, 1); 
    updateCartUi(); 

    // Deshabilitar botón
    event.target.disabled = true;
    event.target.textContent = "En el carrito";
  }
});

document.querySelector(".cartContainer").addEventListener("click", (event) => {
  const cartItemsString = localStorage.getItem('cartItems');
  const cartItems = JSON.parse(cartItemsString);
  if (event.target.classList.contains("cartRemove")) {
    const productId = event.target
      .closest(".cartItem")
      .getAttribute("data-id");

    removeFromCart(productId); 
    updateCartUi(); 
  }

  if (event.target.classList.contains("cartIncrease")) {
    const productId = event.target
      .closest(".cartItem")
      .getAttribute("data-id");

    const product = cartItems.find(item => item.id === productId);
    if (product) {
      addToCart({ id: productId, title: product.title, price: product.price }, 1);  
      updateCartUi(); 
    }
  }

  if (event.target.classList.contains("cartDecrease")) {
    const productId = event.target
      .closest(".cartItem")
      .getAttribute("data-id");

    const product = cartItems.find(item => item.id === productId);
    if (product && product.quantity > 1) {
      addToCart({ id: productId, title: product.title, price: product.price }, -1); 
      updateCartUi(); 
    }
  }
});