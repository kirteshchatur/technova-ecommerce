import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext.jsx';

const CompareContext = createContext();

export const CompareProvider = ({ children }) => {
  const { addToast } = useToast();
  const [compareItems, setCompareItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('technova_compare') || '[]');
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('technova_compare', JSON.stringify(compareItems));
  }, [compareItems]);

  const addToCompare = (product) => {
    if (compareItems.some(i => i.id === product.id)) {
      setCompareItems(prev => prev.filter(i => i.id !== product.id));
      addToast(`Removed ${product.name} from comparison`, 'info');
      return;
    }

    if (compareItems.length >= 4) {
      addToast('You can compare a maximum of 4 products at once.', 'error');
      return;
    }

    setCompareItems(prev => [...prev, product]);
    addToast(`Added ${product.name} to comparison`);
  };

  const removeFromCompare = (productId) => {
    setCompareItems(prev => prev.filter(i => i.id !== productId));
  };

  const clearCompare = () => {
    setCompareItems([]);
    addToast('Comparison list cleared', 'info');
  };

  const isInCompare = (productId) => {
    return compareItems.some(i => i.id === productId);
  };

  return (
    <CompareContext.Provider
      value={{
        compareItems,
        compareCount: compareItems.length,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => useContext(CompareContext);
