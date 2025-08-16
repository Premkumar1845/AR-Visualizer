import React from 'react';
import { Eye, Rotate3D, Maximize } from 'lucide-react';
import { motion } from 'framer-motion';

interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  image: string;
  description: string;
  features: string[];
}

interface ProductCatalogProps {
  onProductSelect: (product: Product) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({ onProductSelect }) => {
  const products: Product[] = [
    {
      id: '1',
      name: 'Modern Sofa',
      category: 'Furniture',
      price: '$1,299',
      image: 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Comfortable modern sofa with premium fabric upholstery',
      features: ['3-seater', 'Premium fabric', 'Ergonomic design']
    },
    {
      id: '2',
      name: 'Coffee Table',
      category: 'Furniture',
      price: '$399',
      image: 'https://images.pexels.com/photos/1772123/pexels-photo-1772123.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Sleek wooden coffee table with storage compartments',
      features: ['Oak wood', 'Storage space', 'Minimalist design']
    },
    {
      id: '3',
      name: 'Floor Lamp',
      category: 'Lighting',
      price: '$229',
      image: 'https://images.pexels.com/photos/1909403/pexels-photo-1909403.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Contemporary floor lamp with adjustable brightness',
      features: ['LED lighting', 'Adjustable height', 'Energy efficient']
    },
    {
      id: '4',
      name: 'Bookshelf',
      category: 'Storage',
      price: '$599',
      image: 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Multi-tier wooden bookshelf for modern spaces',
      features: ['5 shelves', 'Solid wood', 'Easy assembly']
    },
    {
      id: '5',
      name: 'Dining Chair',
      category: 'Furniture',
      price: '$179',
      image: 'https://images.pexels.com/photos/1148952/pexels-photo-1148952.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Ergonomic dining chair with cushioned seat',
      features: ['Cushioned seat', 'Ergonomic', 'Durable frame']
    },
    {
      id: '6',
      name: 'Wall Art',
      category: 'Decor',
      price: '$89',
      image: 'https://images.pexels.com/photos/1194420/pexels-photo-1194420.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Contemporary wall art piece for modern interiors',
      features: ['Canvas print', 'UV resistant', 'Ready to hang']
    }
  ];

  return (
    <section id="products" className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Product Catalog
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Explore our collection of 3D products and visualize them in your space 
            with our advanced AR technology.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-xl rounded-xl overflow-hidden border border-white/20 hover:bg-white/20 transition-all duration-300 group"
            >
              <div className="relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                    {product.category}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-white">{product.name}</h3>
                  <span className="text-lg font-bold text-purple-400">{product.price}</span>
                </div>
                
                <p className="text-white/70 mb-4 leading-relaxed">
                  {product.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {product.features.map((feature, featureIndex) => (
                    <span
                      key={featureIndex}
                      className="bg-white/10 text-white/80 px-2 py-1 rounded-full text-xs"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onProductSelect(product)}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View in AR</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onProductSelect(product)}
                    className="bg-white/10 text-white px-3 py-2 rounded-lg hover:bg-white/20 transition-all duration-300"
                    title="Quick Preview"
                  >
                    <Rotate3D className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};