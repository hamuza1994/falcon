# POCC PWA - Setup & Configuration

## Project Overview

This is a **Provincial Operations Coordination Centre (POCC)** Progressive Web Application built with:
- Next.js 16 with App Router
- React 19 with Framer Motion animations
- Tailwind CSS 4.2 for styling
- shadcn/ui components
- next-pwa for offline support

## Features

- **Login Page**: Beautiful, animated authentication with PWA support
- **Dashboard**: Real-time operations overview with key metrics
- **Tactical Map**: Interactive Uganda map with operational markers
- **Geospatial Intel**: Live incident mapping and monitoring
- **ICE Analysis**: Immigration, Customs & Border Enforcement tracking
- **Alerts System**: Real-time alert management and incident tracking
- **Settings**: User preferences and security configuration

## Quick Start

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Run Development Server
```bash
pnpm dev
```

The app will start at `http://localhost:3000`

### 3. Access the Application

**Login Page**: http://localhost:3000
- Use any email and password to test (mock authentication)
- On success, you'll be redirected to the dashboard

**Dashboard**: http://localhost:3000/dashboard
- View operations overview and key metrics
- Access all main features from the sidebar

### 4. Install as PWA

1. Open the app in your browser
2. Look for the "Install" button (browser dependent) or use the menu
3. Click to install as a native app
4. Works offline with cached assets

## Project Structure

```
app/
├── page.tsx                 # Login page (entry point)
├── dashboard/
│   └── page.tsx            # Main dashboard
├── tactical-map/
│   └── page.tsx            # Interactive Uganda map
├── geospatial/
│   └── page.tsx            # Geospatial intelligence
├── ice-analysis/
│   └── page.tsx            # Border & customs analysis
├── alerts/
│   └── page.tsx            # Alert management
├── settings/
│   └── page.tsx            # User settings
└── layout.tsx              # Root layout with PWA config

components/
├── login-form.tsx          # Login form with validation
├── animated-background.tsx # Animated login background
├── sidebar-nav.tsx         # Navigation sidebar
├── tactical-map-display.tsx    # Tactical map component
├── geospatial-intel-display.tsx # Geospatial component
└── ice-analysis-display.tsx     # ICE analysis component

public/
├── manifest.json           # PWA manifest
├── sw.js                   # Service worker
└── icon-*.png             # App icons

globals.css                 # Tailwind config & theme
```

## Authentication

### Current Implementation (Mock)
The login form accepts any valid email/password combination for testing:
- Email: any valid email format (e.g., `admin@pocc.ug`)
- Password: any password

### Real API Integration
To connect to a real backend:

1. Update `components/login-form.tsx`:
```tsx
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
})

const data = await response.json()
if (response.ok) {
  localStorage.setItem('access_token', data.accessToken)
  localStorage.setItem('user', JSON.stringify(data.user))
  router.push('/dashboard')
}
```

2. Set up environment variables:
```env
NEXT_PUBLIC_API_URL=https://your-api.com/api/v1
API_SECRET_KEY=your_secret_key
```

## Navigation

All authenticated pages use the sidebar navigation with:
- Dashboard
- Tactical Map
- Geospatial Intelligence
- ICE Analysis
- Alerts
- Settings
- Logout button

The sidebar is responsive and collapses on mobile devices.

## Styling & Theming

The app uses a dark theme optimized for 24/7 operations:
- Primary color: Blue (`#0066cc`)
- Accent color: Cyan (`#00d9ff`)
- Background: Slate-950 (very dark blue)
- Text: Slate-50 (near white)

To customize colors, edit `app/globals.css` and the component Tailwind classes.

## PWA Configuration

The app includes PWA support with:
- Service Worker for offline caching
- Web App Manifest for native installation
- Custom app icons for various sizes
- Installable on desktop and mobile

Configuration in:
- `public/manifest.json` - PWA metadata
- `public/sw.js` - Service worker logic
- `next.config.mjs` - next-pwa configuration

## Animations

All transitions and animations use Framer Motion:
- Page load animations
- Component entrance animations
- Button interactions
- Navigation transitions

Animations can be adjusted in component files (look for `motion.div` tags).

## Mobile Support

The app is fully responsive with:
- Mobile-first design approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly interactive elements
- Mobile navigation menu

## Security Notes

Current implementation is for development/demo purposes. For production:

1. **Authentication**: Implement proper JWT-based authentication
2. **HTTPS**: Always use HTTPS in production
3. **CORS**: Configure proper CORS headers on your API
4. **Token Storage**: Consider using httpOnly cookies instead of localStorage
5. **Input Validation**: Sanitize all user inputs
6. **Rate Limiting**: Implement API rate limiting
7. **Secrets**: Never commit API keys or secrets

## Debugging

Enable debug logging by checking browser console:
- Login flow: Check Network tab for API calls
- Service Worker: Chrome DevTools > Application > Service Workers
- Offline: Offline checkbox in DevTools > Network tab
- Storage: DevTools > Application > Storage

## Deployment

### Deploy to Vercel
```bash
pnpm build
vercel deploy
```

### Environment Variables (Production)
Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=https://your-production-api.com
```

### Build & Export
```bash
pnpm build
pnpm start
```

## Troubleshooting

### Service Worker not registering
- Check browser console for errors
- Ensure `public/sw.js` exists
- Clear browser cache and refresh

### Animations not working
- Verify Framer Motion is installed: `pnpm list framer-motion`
- Check Tailwind CSS is properly configured
- Look for CSS conflicts in DevTools

### PWA not installable
- Must be served over HTTPS (or localhost)
- Check manifest.json is valid
- Ensure app icons are present
- Check browser compatibility

## Support & Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Framer Motion Docs](https://www.framer.com/motion)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [shadcn/ui Docs](https://ui.shadcn.com)

## License

Internal POCC operations system. All rights reserved.
