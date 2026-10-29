# POCC Login - Progressive Web App

A modern, secure authentication interface for the Provincial Operations Coordination Centre (POCC) emergency management system.

## 🚀 Features

- **Progressive Web App (PWA)**: Install as a native app on any device
- **Beautiful Animations**: Smooth Framer Motion transitions and interactions
- **Dark Theme Design**: Eye-friendly interface optimized for 24/7 operations
- **Secure Login**: Form validation and error handling
- **Offline Support**: Service worker for offline functionality
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Accessibility**: WCAG compliant with proper ARIA attributes
- **Performance**: Optimized for fast load times and smooth interactions

## 🛠️ Tech Stack

- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS 4.2
- **Animations**: Framer Motion
- **UI Components**: shadcn/ui
- **PWA**: next-pwa
- **Icons**: Lucide React

## 📦 Installation

### Using shadcn CLI (Recommended)

```bash
npx shadcn-cli@latest init -d
npx shadcn-cli@latest add button input
```

Then install the project:

```bash
git clone <repository-url>
cd pocc-login
pnpm install
pnpm dev
```

### Manual Installation

```bash
pnpm install
pnpm dev
```

The application will be available at `http://localhost:3000`

## 🎨 Design Highlights

### Color Scheme
- **Primary**: Blue (from-blue-600 to-cyan-600)
- **Background**: Slate-950 (dark charcoal)
- **Accents**: Cyan, Blue
- **Text**: Slate-50 (light text)

### Components
- **Login Form**: Centralized, glassmorphic card with backdrop blur
- **Animated Background**: Dynamic orbs and particle effects
- **Form Fields**: Icon-enabled inputs with hover effects
- **Submit Button**: Gradient button with loading state
- **Success State**: Animated success confirmation

## 📱 PWA Features

### Installation
1. Open the app in your browser
2. Click the install button (varies by browser)
3. App installs as a native application
4. Access offline with cached content

### Service Worker
- Caches critical assets
- Handles offline requests
- Updates cache on new deployments

### Manifest Configuration
- App name, description, and start URL
- Icon definitions (192x192, 512x512, maskable)
- Theme colors and display mode

## 🔒 Security Features

- **Form Validation**: Email and password validation
- **Password Visibility Toggle**: Secure password input
- **Error Handling**: User-friendly error messages
- **Loading States**: Prevents double submission
- **HTTPS Ready**: All assets configured for secure delivery

## 🎬 Animation Details

### Page Load
- Smooth fade-in and scale animation
- Staggered form element animations
- Sequential reveal of UI components

### Interactive Elements
- Button hover and tap effects
- Loading spinner rotation
- Success checkmark animation
- Icon hover transitions

### Background
- Floating orbs with organic motion
- Pulsing opacity effects
- Animated particle system
- Grid pattern overlay

## 📖 Usage

### Login Form
1. Enter your email address
2. Enter your password
3. Optionally check "Remember me"
4. Click "Sign In to POCC"
5. Form validates input and handles authentication

### Development

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint
```

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Customize

**Colors**: Edit color values in:
- `components/login-form.tsx`
- `components/animated-background.tsx`
- `app/globals.css`

**Text**: Update strings in:
- `components/login-form.tsx`
- `components/animated-background.tsx`

**PWA Settings**: Modify:
- `public/manifest.json`
- `next.config.mjs`

## 📦 Production Deployment

### Deploy to Vercel

```bash
# Using Vercel CLI
vercel

# Or connect your GitHub repository for automatic deployments
```

### Deploy Anywhere

```bash
pnpm build
pnpm start
```

## 🚀 Performance Optimizations

- Code splitting with Next.js
- Image optimization
- CSS minification
- Service worker caching
- Lazy loading of animations
- Hardware-accelerated transforms

## 🤝 Contributing

Feel free to customize and extend this template for your needs.

## 📄 License

This project is part of the POCC emergency management system.

## 📧 Support

For issues or questions, contact the development team.

---

**Last Updated**: 2025
**Version**: 1.0.0
