<div align="center">

# 🎬 MovieGo

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![Redux](https://img.shields.io/badge/Redux-Toolkit-purple.svg)](https://redux-toolkit.js.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-latest-38B2AC.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-latest-646CFF.svg)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A modern, feature-rich movie and TV show exploration platform built with React. Browse trending content, search for your favorite media, and discover new entertainment with a beautiful, accessible interface.

[Demo](demo-url) · [Report Bug](issues-url) · [Request Feature](issues-url)

![MovieGo Demo](demo-screenshot-url)

</div>

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Key Features](#-key-features)
- [Performance](#-performance)
- [Contributing](#-contributing)
- [License](#-license)
- [Acknowledgments](#-acknowledgments)

---

## 📖 Overview

MovieGo is a comprehensive movie and TV show exploration platform that provides users with a seamless experience to discover, search, and explore entertainment content. Built with modern web technologies and best practices in mind, it offers a highly performant and accessible interface.

### ⭐ Key Highlights

- Real-time search with smart debouncing
- Infinite scroll with optimized loading
- Multi-language video support
- Advanced accessibility features
- Optimized performance

---

## ✨ Features

### 🎯 Content Discovery
- Trending movies and TV shows
- Now playing in theaters
- Top-rated content
- Upcoming releases
- Popular TV shows
- On-air series

### 🔍 Advanced Search
- Real-time search with debouncing
- Multi-category results
- Smart results caching
- Search history preservation

### 🎥 Media Features
- Detailed information pages
- Cast and crew details
- Similar content recommendations
- Rich metadata display

### 🎨 User Experience
- Responsive design
- Dynamic loading states
- Error recovery
- Keyboard accessibility
- Screen reader support

---

## 🛠️ Tech Stack

- **Frontend:** React 19
- **State Management:** Redux Toolkit, RTK Query
- **Routing:** React Router v7
- **Styling:** TailwindCSS
- **Build Tool:** Vite
- **Language:** JavaScript/JSX

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- pnpm (recommended) or npm
- TMDB API key

### Installation

1. Clone the repository
```bash
git clone https://github.com/username/moviego.git
cd moviego
```

2. Install dependencies
```bash
pnpm install
```

3. Configure environment
```bash
cp .env.example .env
```

Update `.env` with your TMDB API key:
```env
VITE_TMDB_API_KEY=your_tmdb_api_key
```

4. Start development server
```bash
pnpm dev
```

Visit `http://localhost:5173` 🎉

### Production Build

```bash
pnpm build
pnpm preview
```

---

## 📁 Project Structure

```
src/
├── assets/         # Static assets
├── components/     # Reusable components
├── config/         # Configuration files
├── pages/         # Page components
├── redux/         # State management
├── routes/        # Routing setup
├── skeletons/     # Loading states
└── utils/         # Utility functions
```

---

## 🌟 Key Features in Detail

### Video Player
- Multi-language support (Hindi/English)
- Smart video selection
- Keyboard navigation
- Focus management
- Loading states
- Error handling

### Performance Optimizations
- Route-based code splitting
- Smart caching with RTK Query
- Component memoization
- Optimized image loading
- Efficient error handling

### Accessibility Features
- ARIA labels
- Keyboard navigation
- Focus management
- Screen reader support
- Status announcements
- Semantic HTML

---

## 📈 Performance

### Core Web Vitals & Metrics

| Metric | Value | Score | Weight |
|--------|-------|-------|--------|
| FCP (First Contentful Paint) | 986 ms | 88 | 10% |
| SI (Speed Index) | 1,427 ms | 86 | 10% |
| LCP (Largest Contentful Paint) | 1,407 ms | 84 | 25% |
| TBT (Total Blocking Time) | 46 ms | 100 | 30% |
| CLS (Cumulative Layout Shift) | 0.00 | 100 | 25% |

### Performance Highlights
- Exceptional TBT score (100) indicating minimal main thread blocking
- Perfect CLS score (100) showing zero layout shifts
- Fast FCP under 1 second
- Optimized LCP for quick content rendering
- Efficient Speed Index for visual completeness

### Additional Metrics
- **Lighthouse Scores**
  - Performance: 92+
  - Accessibility: 92
  - Best Practices: 100
  - SEO: 92

---

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 🙏 Acknowledgments

- [TMDB API](https://www.themoviedb.org/documentation/api) for movie data
- React team for the amazing framework
- Redux team for state management tools
- TailwindCSS team for the styling system

---