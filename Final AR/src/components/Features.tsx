import React from 'react';
import { Smartphone, Cuboid as Cube, Zap, Shield, Users, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const Features: React.FC = () => {
  const features = [
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Mobile-First Design",
      description: "Optimized for smartphones with intuitive touch controls and gesture recognition."
    },
    {
      icon: <Cube className="w-8 h-8" />,
      title: "Real-Time 3D Rendering",
      description: "High-quality 3D models with realistic lighting and shadows in your environment."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Instant Loading",
      description: "Lightning-fast performance with optimized 3D assets and progressive loading."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Privacy Focused",
      description: "All AR processing happens locally on your device. No data collection."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Share & Collaborate",
      description: "Share AR experiences and collaborate with others in real-time."
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Advanced Interactions",
      description: "Rotate, scale, and position objects with natural gestures and controls."
    }
  ];

  return (
    <section id="features" className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Powerful Features
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Our AR platform combines cutting-edge technology with intuitive design 
            to deliver an unparalleled visualization experience.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 w-16 h-16 rounded-xl flex items-center justify-center mb-4 text-white">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-white/70 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};