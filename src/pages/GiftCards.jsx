import React, { useState, useEffect } from 'react';
import { Gift, ShoppingCart, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useCart } from '../context/CartContext';

const GiftCards = () => {
  const [giftCards, setGiftCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();
  
  // Keep track of selected options for each card
  const [selections, setSelections] = useState({});

  useEffect(() => {
    const fetchGiftCards = async () => {
      try {
        const { data, error } = await supabase
          .from('gift_cards')
          .select('*')
          .eq('status', true)
          .order('created_at', { ascending: false });
        if (error) throw error;
        setGiftCards(data || []);
        
        // Initialize selections
        const initialSelections = {};
        data?.forEach(card => {
           initialSelections[card.id] = {
             amount: card.denominations?.[0] || '',
             customAmount: ''
           };
        });
        setSelections(initialSelections);
      } catch (error) {
        console.error('Error fetching gift cards:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGiftCards();
  }, []);

  const handleDenominationChange = (id, amount) => {
    setSelections(prev => ({
      ...prev,
      [id]: { ...prev[id], amount, customAmount: '' }
    }));
  };

  const handleCustomAmountChange = (id, val) => {
    setSelections(prev => ({
      ...prev,
      [id]: { ...prev[id], amount: 'custom', customAmount: val }
    }));
  };

  const handleAddToCart = (card) => {
    const sel = selections[card.id];
    if (!sel) return;
    
    let amount = sel.amount === 'custom' ? Number(sel.customAmount) : Number(sel.amount);
    
    if (!amount || isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    
    addToCart(card, 'gift_card', amount);
    alert(`${card.name} of ₹${amount} added to cart!`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-28 sm:pt-32 pb-20 flex items-center justify-center bg-slate-950">
        <Loader2 className="animate-spin text-cyan-500" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24 sm:pt-28 pb-16 px-4 sm:px-6 md:px-8 lg:px-16 selection:bg-cyan-500 selection:text-slate-950">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-900 via-indigo-950 to-purple-950 p-6 sm:p-8 md:p-12 mb-10 sm:mb-12 border border-white/10 shadow-2xl">
        <div className="absolute top-0 right-0 w-72 sm:w-96 h-72 sm:h-96 bg-cyan-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative max-w-2xl z-10">
          <div className="inline-flex items-center gap-2 bg-cyan-500/20 text-cyan-400 px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wider mb-4 border border-cyan-500/30">
            <Gift size={14} /> Gift Card Store
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-4 leading-tight">
            Give the Gift of <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">Choice</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base md:text-lg">
            Purchase premium digital gift cards from top brands instantly. Add them to your cart and check out seamlessly.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {giftCards.map((card) => {
          const sel = selections[card.id] || {};
          return (
            <div key={card.id} className="bg-slate-900 border border-white/10 rounded-2xl p-5 sm:p-6 hover:border-cyan-500/40 transition-all duration-300 flex flex-col">
              <div className="h-40 sm:h-48 rounded-xl overflow-hidden mb-6 relative bg-white/5 flex items-center justify-center">
                <img src={card.image} alt={card.name} className="w-full h-full object-cover mix-blend-lighten" />
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-white/10">
                  e-Gift Card
                </div>
              </div>
              
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{card.name}</h3>
              <p className="text-slate-400 text-sm mb-6 flex-grow">Select an amount or enter a custom value to add to your cart.</p>
              
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  {card.denominations?.map((den) => (
                    <button
                      key={den}
                      onClick={() => handleDenominationChange(card.id, den)}
                      className={`py-2 rounded-lg text-xs sm:text-sm font-bold transition-all border ${
                        sel.amount === den && sel.amount !== 'custom'
                          ? 'bg-cyan-500 border-cyan-400 text-slate-950'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      ₹{den}
                    </button>
                  ))}
                </div>
                
                {card.allow_custom_amount && (
                  <div className="flex flex-col sm:flex-row gap-2 sm:items-center mt-2">
                    <button
                      onClick={() => handleDenominationChange(card.id, 'custom')}
                      className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all border ${
                        sel.amount === 'custom'
                          ? 'bg-cyan-500 border-cyan-400 text-slate-950'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      Custom
                    </button>
                    <div className="relative flex-grow">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                      <input
                        type="number"
                        placeholder="Amount"
                        value={sel.customAmount}
                        onChange={(e) => handleCustomAmountChange(card.id, e.target.value)}
                        disabled={sel.amount !== 'custom'}
                        className="w-full bg-black/50 border border-white/10 rounded-lg py-2 pl-8 pr-4 text-sm text-white focus:outline-none focus:border-cyan-500 disabled:opacity-50"
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <button 
                onClick={() => handleAddToCart(card)}
                disabled={card.stock <= 0}
                className="w-full mt-6 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20"
              >
                <ShoppingCart size={18} /> {card.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          );
        })}
        {giftCards.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400">
            No gift cards available at the moment.
          </div>
        )}
      </div>
    </div>
  );
};

export default GiftCards;