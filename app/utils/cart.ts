// Cart utilities for managing cart state in cookies

export interface CartItem {
  productId: string;
  title: string;
  productCode: string;
  imgSrc: string;
  selectedColor: string;
  selectedSize: string;
  quantity: number;
  priceRange: string;
  brand: string;
  addedAt: number; // timestamp
}

const CART_COOKIE_NAME = "elliott_cart";
const CART_EXPIRY_DAYS = 30;

// Helper to check if we're in browser environment
const isBrowser = typeof window !== "undefined";

// Get cart items from cookie
export function getCartItems(): CartItem[] {
  if (!isBrowser) return [];

  try {
    const cartCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${CART_COOKIE_NAME}=`));

    if (!cartCookie) return [];

    const cartData = decodeURIComponent(cartCookie.split("=")[1]);
    const items = JSON.parse(cartData) as CartItem[];

    // Filter out expired items (older than 30 days)
    const now = Date.now();
    const validItems = items.filter(
      (item) => now - item.addedAt < CART_EXPIRY_DAYS * 24 * 60 * 60 * 1000
    );

    // If we filtered out items, update the cookie
    if (validItems.length !== items.length) {
      saveCartItems(validItems);
    }

    return validItems;
  } catch (error) {
    console.error("Error reading cart cookie:", error);
    return [];
  }
}

// Save cart items to cookie
export function saveCartItems(items: CartItem[]): void {
  if (!isBrowser) return;

  try {
    const cartData = JSON.stringify(items);
    const encodedData = encodeURIComponent(cartData);

    // Set cookie with expiry
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + CART_EXPIRY_DAYS);

    document.cookie = `${CART_COOKIE_NAME}=${encodedData}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;

    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent("cartUpdated"));
  } catch (error) {
    console.error("Error saving cart cookie:", error);
  }
}

// Add item to cart
export function addToCart(newItem: Omit<CartItem, "addedAt">): void {
  const items = getCartItems();
  const now = Date.now();

  // Check if item with same product, color, and size already exists
  const existingItemIndex = items.findIndex(
    (item) =>
      item.productId === newItem.productId &&
      item.selectedColor === newItem.selectedColor &&
      item.selectedSize === newItem.selectedSize
  );

  if (existingItemIndex >= 0) {
    // Update quantity of existing item
    items[existingItemIndex].quantity += newItem.quantity;
    items[existingItemIndex].addedAt = now; // Update timestamp
  } else {
    // Add new item
    items.push({
      ...newItem,
      addedAt: now,
    });
  }

  saveCartItems(items);
}

// Remove item from cart
export function removeFromCart(
  productId: string,
  selectedColor: string,
  selectedSize: string
): void {
  const items = getCartItems();
  const updatedItems = items.filter(
    (item) =>
      !(
        item.productId === productId &&
        item.selectedColor === selectedColor &&
        item.selectedSize === selectedSize
      )
  );

  saveCartItems(updatedItems);
}

// Update item quantity in cart
export function updateCartItemQuantity(
  productId: string,
  selectedColor: string,
  selectedSize: string,
  newQuantity: number
): void {
  if (newQuantity <= 0) {
    removeFromCart(productId, selectedColor, selectedSize);
    return;
  }

  const items = getCartItems();
  const itemIndex = items.findIndex(
    (item) =>
      item.productId === productId &&
      item.selectedColor === selectedColor &&
      item.selectedSize === selectedSize
  );

  if (itemIndex >= 0) {
    items[itemIndex].quantity = newQuantity;
    items[itemIndex].addedAt = Date.now(); // Update timestamp
    saveCartItems(items);
  }
}

// Get total number of items in cart
export function getCartCount(): number {
  const items = getCartItems();
  return items.reduce((total, item) => total + item.quantity, 0);
}

// Clear entire cart
export function clearCart(): void {
  if (!isBrowser) return;

  // Remove the cookie by setting it to expire in the past
  document.cookie = `${CART_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

// Get unique item count (different products/variants)
export function getUniqueItemCount(): number {
  return getCartItems().length;
}

// Check if a specific item is in cart
export function isItemInCart(
  productId: string,
  selectedColor: string,
  selectedSize: string
): boolean {
  const items = getCartItems();
  return items.some(
    (item) =>
      item.productId === productId &&
      item.selectedColor === selectedColor &&
      item.selectedSize === selectedSize
  );
}
