import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { ProductCatalog } from './components/ProductCatalog';
import { ARViewer } from './components/ARViewer';
import { Footer } from './components/Footer';

function App() {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isARMode, setIsARMode] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  const handleProductSelect = (product: any) => {
    setSelectedProduct(product);
    setIsARMode(true);
    setShowDemo(false);
  };

  const handleCloseAR = () => {
    setIsARMode(false);
    setSelectedProduct(null);
    setShowDemo(false);
  };

  const handleStartAR = () => {
    // Show the first product (Modern Sofa) in AR mode
    const demoProduct = {
      id: '1',
      name: 'Modern Sofa',
      category: 'Furniture',
      price: '$1,299',
      description: 'Comfortable modern sofa with premium fabric upholstery',
      features: ['3-seater', 'Premium fabric', 'Ergonomic design']
    };
    setSelectedProduct(demoProduct);
    setIsARMode(true);
    setShowDemo(false);
  };

  const handleViewDemo = () => {
    // Scroll to the product catalog section
    const productSection = document.getElementById('products');
    if (productSection) {
      productSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      
      {isARMode && selectedProduct ? (
        <ARViewer product={selectedProduct} onClose={handleCloseAR} />
      ) : (
        <>
          <Hero onStartAR={handleStartAR} onViewDemo={handleViewDemo} />
          <Features />
          <ProductCatalog onProductSelect={handleProductSelect} />
          <Footer />
        </>
      )}
    </div>
  );
}

export default App;