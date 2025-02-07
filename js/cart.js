let cartItems = [];

export const createProduct = (id, title, price) => ({ id, title, price });

export const getCartItems = () => {
  return [...cartItems];
};

export const addToCart = (product, quantity) => {
  const existsInTheCart = cartItems.find((item) => item.id === product.id);

  if (existsInTheCart) {
    existsInTheCart.quantity += quantity;
  } else {
    cartItems.push({ ...product, quantity });
  }

  saveCartToLocalStorage(); 

  Swal.fire({
    title: "¡Producto agregado!",
    text: `${product.title} agregado al carrito`,
    icon: "success",
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    background: "linear-gradient(to right,rgb(44, 150, 212),rgb(46, 206, 255))",
    color: "#fff",
  });
};

export const removeFromCart = (id) => {
  cartItems = cartItems.filter((item) => item.id !== id);
  saveCartToLocalStorage(); 
};

const saveCartToLocalStorage = () => {
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
};

export const clearCart = () => {
  cartItems = [];
  saveCartToLocalStorage(); 
};
 
export const buyCart = () => {
  Swal.fire({
    title: "¡Atención!",
    text: "La opción estará próximamente disponible",
    icon: "info",
    confirmButtonText: "Ok"
  });
};
export const loadCartFromLocalStorage = () => {
  const savedCart = localStorage.getItem("cartItems");
  if (savedCart) {
    cartItems = JSON.parse(savedCart);
  }
};
