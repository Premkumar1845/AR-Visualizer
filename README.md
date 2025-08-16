# AR Visualizer 🥽

A revolutionary AR shopping experience built with React, Three.js, and modern web technologies. Visualize realistic 3D furniture models in your browser with interactive AR capabilities.

![AR Visualizer](https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=800)

## ✨ Features

- 🥽 **Browser-based AR visualization** - No app installation required
- 📱 **Mobile-first responsive design** - Works seamlessly on all devices
- 🎨 **Beautiful UI with Tailwind CSS** - Modern, clean interface
- ⚡ **Lightning-fast performance** - Optimized with Vite
- 🎭 **Smooth animations** - Enhanced with Framer Motion
- 🎯 **Realistic 3D models** - High-quality furniture rendering
- 🎨 **Color customization** - 8 different color options per model
- 💡 **Advanced lighting** - Realistic shadows and illumination
- 🔄 **Interactive controls** - Rotate, scale, and position objects

## 🛋️ 3D Models Included

1. **Modern Sofa** - Complete with cushions and wooden legs
2. **Dining Chair** - Ergonomic design with cushioned seat
3. **Coffee Table** - Wooden table with realistic proportions
4. **Floor Lamp** - Animated lighting with glowing effects
5. **Bookshelf** - Multi-tier shelf with colorful books
6. **Decorative Plant** - Potted plant with animated leaves

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/ar-visualizer.git
cd ar-visualizer
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the development server:**
```bash
npm run dev
```

4. **Open your browser and navigate to:**
```
http://localhost:5173
```

## 🛠️ Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 📁 Project Structure

```
src/
├── components/
│   ├── models/          # 3D model components
│   │   ├── SofaModel.tsx
│   │   ├── ChairModel.tsx
│   │   ├── TableModel.tsx
│   │   ├── LampModel.tsx
│   │   ├── BookshelfModel.tsx
│   │   └── PlantModel.tsx
│   ├── ARViewer.tsx     # Main AR interface
│   ├── Hero.tsx         # Landing section
│   ├── Features.tsx     # Features showcase
│   ├── ProductCatalog.tsx # Product grid
│   ├── Header.tsx       # Navigation
│   └── Footer.tsx       # Footer section
├── App.tsx              # Main app component
├── main.tsx            # App entry point
└── index.css           # Global styles
```

## 🎨 Technologies Used

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Three.js** - 3D graphics library
- **React Three Fiber** - React renderer for Three.js
- **React Three Drei** - Useful helpers for R3F
- **Framer Motion** - Animation library
- **Lucide React** - Beautiful icons

## 🎮 Usage

### Basic Navigation
- Click **"Start AR Experience"** for immediate 3D model interaction
- Click **"View Demo"** to browse all available models
- Select any product to open in AR viewer

### AR Controls
- **Drag** to rotate the model
- **Scroll** to zoom in/out
- **Right-click + drag** to pan around
- **Color picker** to change model colors
- **Control buttons** for different interaction modes

### Mobile Experience
- Touch gestures for model manipulation
- Responsive design adapts to all screen sizes
- Optimized performance for mobile devices

## 🌐 Live Demo

[View Live Demo](https://resplendent-cendol-ba0d77.netlify.app)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Three.js community for excellent 3D capabilities
- React Three Fiber team for seamless React integration
- Tailwind CSS for beautiful styling utilities
- Framer Motion for smooth animations

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

**Built with ❤️ using modern web technologies**
