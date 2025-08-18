# Chinese Learning App

A comprehensive web application for learning Chinese through text segmentation, Pinyin pronunciation, and vocabulary management.

## Features

### 🎯 Core Features
- **Text Segmentation**: Intelligent Chinese word segmentation
- **Pinyin & Translations**: Hover over words to see Pinyin and English translations
- **Vocabulary Management**: Save words to different learning levels (Beginner, Intermediate, Advanced)
- **Speech Synthesis**: Text-to-speech functionality for Chinese pronunciation
- **User Authentication**: Personal accounts with progress tracking
- **Responsive Design**: Works on desktop, tablet, and mobile devices

### 🚀 Technical Features
- Built with React 19 and TypeScript
- Real-time Chinese text processing
- Local storage for offline functionality
- Progressive Web App (PWA) ready
- Modern, accessible UI/UX design

## Demo

Try the app with sample text like:
```
我今天去学校学习中文
```

## Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd chinese-learning-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
```

The build folder will contain the optimized production files.

## Available Scripts

- `npm start`: Start development server
- `npm run build`: Build for production  
- `npm test`: Run tests
- `npm run deploy`: Deploy locally with serve
- `npm run deploy:netlify`: Deploy to Netlify
- `npm run deploy:vercel`: Deploy to Vercel

## Usage Guide

### 1. Text Input
- Enter or paste Chinese text in the input field
- Click "Segment and Convert" to process the text

### 2. Learning Words
- Hover over segmented words to see detailed information
- Click the speaker icon to hear pronunciation
- Save words to your vocabulary using the level buttons (1, 2, or 3)

### 3. Vocabulary Management
- View saved words by level in the Vocabulary Manager
- Export your vocabulary as JSON
- Track your learning progress

### 4. Speech Features
- Use speech controls to hear full text or individual words
- Adjust speech rate and select different voices
- Compatible with various text-to-speech engines

### 5. User Accounts
- Register or login to save progress across sessions
- View learning statistics
- Personal vocabulary persistence

## Technology Stack

### Frontend
- **React 19**: Modern UI framework
- **TypeScript**: Type-safe development
- **CSS3**: Modern styling with animations
- **Web Speech API**: Text-to-speech functionality

### Libraries & Tools
- **pinyin-pro**: Chinese to Pinyin conversion
- **React Hooks**: State management
- **Context API**: Global state for authentication and vocabulary
- **LocalStorage**: Offline data persistence

## Deployment

The app can be deployed to various platforms:

### Quick Deploy Options
- **Netlify**: Connect GitHub repo for automatic deployment
- **Vercel**: Connect GitHub repo for automatic deployment
- **GitHub Pages**: Use gh-pages for static hosting
- **Docker**: Use included Dockerfile for containerized deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## Browser Support

- **Chrome**: Full support including speech synthesis
- **Firefox**: Full support
- **Safari**: Full support
- **Edge**: Full support
- **Mobile browsers**: Responsive design with touch support

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

---

**Happy Learning! 学习愉快！**
