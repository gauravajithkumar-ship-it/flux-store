import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useProducts } from './ProductContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [savedItems, setSavedItems] = useState([]); // Kept local for now
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // New coupon states
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [isCouponLoading, setIsCouponLoading] = useState(false);
  const [couponMessage, setCouponMessage] = useState(null); // { type: 'success'|'error', text: '' }

  const { products, isLoading: isProductsLoading } = useProducts();

  // Initialize Device ID and Fetch Cart
  useEffect(() => {
    let id = localStorage.getItem('cart_device_id');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('cart_device_id', id);
    }
    setDeviceId(id);
    
    // Only fetch cart items if products are loaded
    if (!isProductsLoading) {
      fetchCartItems(id, products);
    }
  }, [isProductsLoading, products]);

  // Fetch available coupons on mount
  useEffect(() => {
    fetchAvailableCoupons();
  }, []);

  const fetchAvailableCoupons = async () => {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('is_active', true)
        .gt('expiry_date', new Date().toISOString())
        .order('discount_value', { ascending: false });

      if (error) throw error;

      // Filter out coupons that have exceeded their usage limit
      const validCoupons = (data || []).filter(c => 
        c.usage_limit === null || c.used_count < c.usage_limit
      );

      setAvailableCoupons(validCoupons);
    } catch (err) {
      console.error('Error fetching available coupons:', err);
    }
  };

  const fetchCartItems = async (id, availableProducts = []) => {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select('*')
        .eq('device_id', id);

      if (error) throw error;

      // Fetch active gift cards
      const { data: gcData } = await supabase
        .from('gift_cards')
        .select('*')
        .eq('status', true);
      const availableGiftCards = gcData || [];

      // Map Supabase rows to our product objects + quantity
      const items = data.map(row => {
        if (row.item_type === 'gift_card') {
          const gc = availableGiftCards.find(g => g.id === row.product_id);
          if (gc) {
            return { ...gc, quantity: row.quantity, dbId: row.id, item_type: 'gift_card', custom_amount: Number(row.custom_amount) };
          }
        } else {
          const product = availableProducts.find(p => p.id === row.product_id);
          if (product) {
            return { ...product, quantity: row.quantity, dbId: row.id, item_type: 'product' };
          }
        }
        return null;
      }).filter(Boolean);

      setCartItems(items);
    } catch (err) {
      console.error('Error fetching cart:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (product, itemType = 'product', customAmount = null) => {
    const isGiftCard = itemType === 'gift_card';
    const numAmount = customAmount ? Number(customAmount) : null;

    // Optimistic update
    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => 
        item.id === product.id && 
        (isGiftCard ? item.custom_amount === numAmount : true)
      );
      if (existingIndex >= 0) {
        const newItems = [...prev];
        newItems[existingIndex].quantity += 1;
        return newItems;
      }
      return [...prev, { ...product, quantity: 1, item_type: itemType, custom_amount: numAmount }];
    });
    
    setIsCartOpen(true); // Open drawer when item is added

    try {
      let query = supabase
        .from('cart_items')
        .select('*')
        .eq('device_id', deviceId)
        .eq('product_id', product.id)
        .eq('item_type', itemType);
        
      if (isGiftCard && numAmount !== null) {
        query = query.eq('custom_amount', numAmount);
      } else if (isGiftCard) {
        query = query.is('custom_amount', null);
      }

      const { data: existingRows } = await query;
      const existingItem = existingRows?.[0];
      
      if (existingItem) {
        await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + 1 })
          .eq('id', existingItem.id);
      } else {
        await supabase
          .from('cart_items')
          .insert([
            { device_id: deviceId, product_id: product.id, quantity: 1, item_type: itemType, custom_amount: numAmount }
          ]);
      }
      
      fetchCartItems(deviceId, products);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }

    setSavedItems(prev => prev.filter(item => item.id !== product.id));
  };

  const removeFromCart = async (productId, itemType = 'product', customAmount = null) => {
    const isGiftCard = itemType === 'gift_card';
    const numAmount = customAmount ? Number(customAmount) : null;

    // Optimistic update
    setCartItems(prev => prev.filter(item => 
      !(item.id === productId && (isGiftCard ? item.custom_amount === numAmount : true))
    ));

    try {
      let query = supabase
        .from('cart_items')
        .delete()
        .eq('device_id', deviceId)
        .eq('product_id', productId)
        .eq('item_type', itemType);

      if (isGiftCard && numAmount !== null) {
        query = query.eq('custom_amount', numAmount);
      } else if (isGiftCard) {
        query = query.is('custom_amount', null);
      }

      await query;
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const updateQuantity = async (productId, quantity, itemType = 'product', customAmount = null) => {
    const isGiftCard = itemType === 'gift_card';
    const numAmount = customAmount ? Number(customAmount) : null;

    if (quantity < 1) {
      removeFromCart(productId, itemType, customAmount);
      return;
    }

    // Optimistic update
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId && (isGiftCard ? item.custom_amount === numAmount : true)
          ? { ...item, quantity } 
          : item
      )
    );

    try {
      let query = supabase
        .from('cart_items')
        .update({ quantity })
        .eq('device_id', deviceId)
        .eq('product_id', productId)
        .eq('item_type', itemType);

      if (isGiftCard && numAmount !== null) {
        query = query.eq('custom_amount', numAmount);
      } else if (isGiftCard) {
        query = query.is('custom_amount', null);
      }

      await query;
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const saveForLater = (productId) => {
    const item = cartItems.find(item => item.id === productId);
    if (item) {
      setSavedItems(prev => [...prev, { ...item, quantity: 1 }]);
      removeFromCart(productId);
    }
  };

  const moveToCart = (productId) => {
    const item = savedItems.find(item => item.id === productId);
    if (item) {
      addToCart(item);
      setSavedItems(prev => prev.filter(i => i.id !== productId));
    }
  };

  const removeFromSaved = (productId) => {
    setSavedItems(prev => prev.filter(item => item.id !== productId));
  };

  // Supabase-validated coupon application
  const applyCoupon = async (code) => {
    setIsCouponLoading(true);
    setCouponMessage(null);

    try {
      // Query Supabase for the coupon by code
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', code.toUpperCase().trim())
        .single();

      if (error || !data) {
        const msg = { success: false, message: 'Invalid coupon code. Please check and try again.' };
        setCouponMessage({ type: 'error', text: msg.message });
        setIsCouponLoading(false);
        return msg;
      }

      const coupon = data;

      // Validate: is_active
      if (!coupon.is_active) {
        const msg = { success: false, message: 'This coupon is currently inactive.' };
        setCouponMessage({ type: 'error', text: msg.message });
        setIsCouponLoading(false);
        return msg;
      }

      // Validate: not expired
      if (new Date(coupon.expiry_date) < new Date()) {
        const msg = { success: false, message: 'This coupon has expired.' };
        setCouponMessage({ type: 'error', text: msg.message });
        setIsCouponLoading(false);
        return msg;
      }

      // Validate: usage limit not exceeded
      if (coupon.usage_limit !== null && coupon.used_count >= coupon.usage_limit) {
        const msg = { success: false, message: 'This coupon has reached its usage limit.' };
        setCouponMessage({ type: 'error', text: msg.message });
        setIsCouponLoading(false);
        return msg;
      }

      // Validate: minimum order amount
      if (coupon.min_order_amount > 0 && subtotal < coupon.min_order_amount) {
        const minAmount = Number(coupon.min_order_amount).toLocaleString('en-IN');
        const msg = { success: false, message: `Minimum order amount of ₹${minAmount} required.` };
        setCouponMessage({ type: 'error', text: msg.message });
        setIsCouponLoading(false);
        return msg;
      }

      // All validations passed — apply the coupon
      setAppliedCoupon({
        id: coupon.id,
        code: coupon.code,
        type: coupon.discount_type,
        value: Number(coupon.discount_value),
      });

      const msg = { success: true, message: `Coupon '${coupon.code}' applied successfully!` };
      setCouponMessage({ type: 'success', text: msg.message });
      setIsCouponLoading(false);
      return msg;
    } catch (err) {
      console.error('Error applying coupon:', err);
      const msg = { success: false, message: 'Something went wrong. Please try again.' };
      setCouponMessage({ type: 'error', text: msg.message });
      setIsCouponLoading(false);
      return msg;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponMessage(null);
  };

  const getItemPrice = (item) => {
    if (item.item_type === 'gift_card') {
      return item.custom_amount || 0;
    }
    return item.discount
      ? item.price * (1 - item.discount / 100)
      : item.price;
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + getItemPrice(item) * item.quantity, 0
  );

  const FREE_SHIPPING_THRESHOLD = 5000;
  const SHIPPING_COST = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 149;
  const TAX_RATE = 0.18; // 18% GST
  const taxAmount = Math.round(subtotal * TAX_RATE);

  const couponDiscount = appliedCoupon
    ? appliedCoupon.type === 'percentage'
      ? Math.round(subtotal * (appliedCoupon.value / 100))
      : appliedCoupon.value
    : 0;

  const total = Math.round(subtotal + SHIPPING_COST + taxAmount - couponDiscount);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const clearCart = async () => {
    setCartItems([]);
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponMessage(null);
    try {
      await supabase
        .from('cart_items')
        .delete()
        .eq('device_id', deviceId);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      savedItems,
      couponCode,
      setCouponCode,
      appliedCoupon,
      addToCart,
      removeFromCart,
      updateQuantity,
      saveForLater,
      moveToCart,
      removeFromSaved,
      applyCoupon,
      removeCoupon,
      clearCart,
      getItemPrice,
      subtotal,
      SHIPPING_COST,
      FREE_SHIPPING_THRESHOLD,
      taxAmount,
      couponDiscount,
      total,
      cartCount,
      isLoading,
      // New coupon exports
      availableCoupons,
      isCouponLoading,
      couponMessage,
      setCouponMessage,
      fetchAvailableCoupons,
      isCartOpen,
      setIsCartOpen,
    }}>
      {children}
    </CartContext.Provider>
  );
};
