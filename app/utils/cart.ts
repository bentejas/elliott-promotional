// Cart utilities for managing cart state in localStorage

export interface CartItem {
  productId: string;
  title: string;
  productCode: string;
  imgSrc: string;
  selectedColor: string;
  selectedSize: string;
  quantity: number;
  brand: string;
  supplierName?: string;
  addedAt: number; // timestamp
}

const CART_STORAGE_KEY = "elliott_cart";
const LEGACY_CART_COOKIE_NAME = "elliott_cart";
const CART_EXPIRY_DAYS = 30;
const MAX_ITEM_QUANTITY = 9999;

// Helper to check if we're in browser environment
const isBrowser = typeof window !== "undefined";

// One-time migration: carts used to live in a cookie, which silently
// truncates past ~4KB. Move any existing cookie cart into localStorage.
function migrateLegacyCookieCart(): CartItem[] | null {
  try {
    const cartCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${LEGACY_CART_COOKIE_NAME}=`));
    if (!cartCookie) return null;

    const cartData = decodeURIComponent(cartCookie.split("=")[1]);
    const items = JSON.parse(cartData) as CartItem[];

    // Delete the cookie either way
    document.cookie = `${LEGACY_CART_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;

    return Array.isArray(items) ? items : null;
  } catch {
    return null;
  }
}

// Get cart items from storage
export function getCartItems(): CartItem[] {
  if (!isBrowser) return [];

  try {
    let items: CartItem[] = [];
    const stored = window.localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      items = JSON.parse(stored) as CartItem[];
    } else {
      items = migrateLegacyCookieCart() ?? [];
      if (items.length > 0) {
        window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      }
    }

    // Filter out expired items (older than 30 days)
    const now = Date.now();
    const validItems = items.filter(
      (item) => now - item.addedAt < CART_EXPIRY_DAYS * 24 * 60 * 60 * 1000
    );

    // If we filtered out items, persist the pruned list (without
    // dispatching events — reads should stay side-effect-free for callers)
    if (validItems.length !== items.length) {
      window.localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(validItems)
      );
    }

    return validItems;
  } catch (error) {
    console.error("Error reading cart:", error);
    return [];
  }
}

// Save cart items to storage
export function saveCartItems(items: CartItem[]): void {
  if (!isBrowser) return;

  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));

    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent("cartUpdated"));
  } catch (error) {
    console.error("Error saving cart:", error);
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
    items[existingItemIndex].quantity = Math.min(
      items[existingItemIndex].quantity + newItem.quantity,
      MAX_ITEM_QUANTITY
    );
    items[existingItemIndex].addedAt = now; // Update timestamp
  } else {
    // Add new item
    items.push({
      ...newItem,
      quantity: Math.min(newItem.quantity, MAX_ITEM_QUANTITY),
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
    items[itemIndex].quantity = Math.min(newQuantity, MAX_ITEM_QUANTITY);
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

  saveCartItems([]);
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
