import React from 'react';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

const Cart = () => {
  const { cartItems, isCartOpen, toggleCart, updateQuantity, removeFromCart, cartTotal } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={toggleCart}
          />
          
          {/* Cart Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-[#F6F3EE] z-50 shadow-xl"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-[#2B2B2B]/10">
                <h2 className="font-serif text-xl">Your Cart</h2>
                <button
                  onClick={toggleCart}
                  className="font-sans p-2 hover:bg-[#2B2B2B]/5 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto">
                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-6">
                    <ShoppingBag size={48} className="text-[#2B2B2B]/20 mb-4" />
                    <p className="font-sans text-[#2B2B2B]/60 mb-2">Your cart is empty</p>
                    <button
                      onClick={toggleCart}
                      className="font-sans text-[#C88A4A] font-medium hover:underline"
                    >
                      Continue shopping
                    </button>
                  </div>
                ) : (
                  <div className="p-6 space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 bg-white rounded-2xl p-4 shadow-sm">
                        <div className="w-16 h-16 bg-[#2B2B2B]/5 rounded-xl flex-shrink-0" />
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-sans font-medium text-sm truncate">{item.title}</h3>
                          <p className="font-sans text-[#2B2B2B]/60 text-sm">${item.price.toFixed(2)}</p>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-[#2B2B2B]/5 rounded transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="font-sans w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-[#2B2B2B]/5 rounded transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-1 hover:bg-[#2B2B2B]/5 rounded transition-colors text-[#2B2B2B]/40 hover:text-[#2B2B2B]"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {cartItems.length > 0 && (
                <div className="border-t border-[#2B2B2B]/10 p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-serif text-lg">Total</span>
                    <span className="font-serif text-lg">${cartTotal.toFixed(2)}</span>
                  </div>
                  
                  {cartTotal < 100 && (
                    <p className="font-sans text-sm text-[#2B2B2B]/60 text-center">
                      Add ${(100 - cartTotal).toFixed(2)} more for free shipping
                    </p>
                  )}

                  <button className="font-sans w-full bg-[#2B2B2B] text-white py-4 rounded-2xl font-medium hover:bg-[#2B2B2B]/90 transition-colors">
                    Checkout
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Cart;