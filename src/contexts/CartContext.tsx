import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface CartItem {
  idProducto: number;
  nombre: string;
  precio: number;
  cantidad: number;
  imagen: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (idProducto: number) => void;
  clearCart: () => void;
  updateQuantity: (idProducto: number, cantidad: number) => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Guarda carrito en localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: CartItem) => {
    setCartItems(prev => {
      const existing = prev.find(p => p.idProducto === item.idProducto);
      if (existing) {
        return prev.map(p =>
          p.idProducto === item.idProducto
            ? { ...p, cantidad: p.cantidad + item.cantidad }
            : p
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (idProducto: number) => {
    setCartItems(prev => prev.filter(p => p.idProducto !== idProducto));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const updateQuantity = (idProducto: number, cantidad: number) => {
    setCartItems(prev =>
      prev.map(p =>
        p.idProducto === idProducto ? { ...p, cantidad } : p
      )
    );
  };

  const total = cartItems.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, updateQuantity, total }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart debe usarse dentro de CartProvider');
  return context;
};
