# POCC PWA - Backend Integration Guide

## System Architecture

Your POCC (Provincial Operations Coordination Centre) PWA is now fully integrated with backend API services.

### Backend API Base URL
```
https://security-backend-dsya.onrender.com/api/v1
```

## Authentication & Session Management

### UserSession Structure
The app implements a comprehensive session management system with the following user profile:

```typescript
interface UserSession {
  userId: string
  fullName: string
  role: UserRole // ADMIN | OPERATOR | ANALYST | INTEL_ANALYST
  clearance: ClearanceLevel // CL5_TOP_SECRET → CL1_PUBLIC
  organization: string // e.g., "MINISTRY_OF_SECURITY"
}
```

### Login Flow
1. User submits email/password on login page
2. API call to `POST /auth/login` with credentials
3. Backend returns `accessToken`, `refreshToken`, and user data
4. Tokens stored in localStorage
5. User redirected to `/dashboard` with session active

### Token Management
- **Access Token**: Stored as `access_token` in localStorage
- **Refresh Token**: Stored as `refresh_token` for token refresh
- **User Data**: Stored as `user` JSON object in localStorage
- **Auto-redirect**: Authenticated users bypass login page

## Pages & Features

### 1. Login Page (`/`)
- Beautiful animated entry point with Framer Motion
- Real API integration with the backend
- Session persistence and auto-redirect
- Error handling and validation

### 2. Dashboard (`/dashboard`)
- Main operations hub
- User session card showing: Name, Email, Role, Clearance, Organization
- Real-time metrics and statistics
- Protected route (requires authentication)

### 3. Citizenship Registry (`/citizenship`)
- Citizen database with full profiles
- Advanced search and filtering
- Risk level assessment
- Political affiliation tracking
- Family member monitoring
- Detailed modal views with complete citizen intelligence

### 4. Incidents Management (`/incidents`)
- Real-time incident tracking
- Severity classification (CRITICAL, HIGH, MEDIUM, LOW)
- Status tracking (REPORTED, INVESTIGATING, RESOLVED, CLOSED)
- Charts and analytics
- Evidence tracking
- Detailed incident modal with full case information

### 5. Tactical Map (`/tactical-map`)
- Interactive Uganda map display
- Operational marker positioning
- Real-time tactical intelligence

### 6. Geospatial Intelligence (`/geospatial`)
- Live incident monitoring
- Geographic data visualization
- Real-time operational tracking

### 7. ICE Analysis (`/ice-analysis`)
- Immigration & Border Enforcement tracking
- Personnel database integration
- Operational coordination

### 8. Alerts (`/alerts`)
- Real-time alert management
- Priority-based notification system
- Alert filtering and search

### 9. Settings (`/settings`)
- User preferences configuration
- Security settings
- Account management

## API Integration Details

### Login Endpoint
```
POST /auth/login
Body: {
  email: string
  password: string
  organization?: string
}

Response: {
  success: boolean
  data: {
    accessToken: string
    refreshToken: string
    user: {
      id: string
      email: string
      fullName: string
      role: string
      clearance: string
      organization: string
    }
  }
}
```

### Token Refresh
The API service includes automatic token refresh interceptors that:
- Detect 401 Unauthorized responses
- Attempt refresh with refresh token
- Update access token automatically
- Redirect to login on complete failure

### Request Headers
All API requests include:
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

## Data Services

### Citizens Service
- `getAll(params)` - Fetch citizens with pagination
- `getById(id)` - Get individual citizen
- `getByNationalId(nationalId)` - Search by ID
- `create(data)` - Register new citizen
- `update(id, data)` - Update citizen info
- `delete(id)` - Deactivate citizen
- `getDashboardStats()` - Fetch statistics

### Employees Service
- `getAll(params)` - List personnel database
- `getById(id)` - Get employee details
- `getByNSPID(nspid)` - Search by NSPID
- `getDashboardStats()` - Get statistics
- `getAssets(employeeId)` - Financial assets
- `getAllowances(employeeId)` - Allowance records

### Incidents Service
- `getAll(filters)` - List incidents with pagination
- `getById(id)` - Get incident details
- `create(data)` - Report new incident
- `update(id, data)` - Update incident status
- `delete(id)` - Archive incident

## Files & Structure

```
/app
  /page.tsx                 # Login page with redirect
  /dashboard/page.tsx       # Main dashboard
  /citizenship/page.tsx     # Citizen registry with modal
  /incidents/page.tsx       # Incident management with modal
  /tactical-map/page.tsx    # Interactive map
  /geospatial/page.tsx      # Geospatial intel
  /ice-analysis/page.tsx    # ICE operations
  /alerts/page.tsx          # Alert management
  /settings/page.tsx        # User settings

/lib
  /api.ts                   # Axios instance & API services
  /auth-context.tsx         # Session management context
  /types.ts                 # TypeScript interfaces

/components
  /sidebar-nav.tsx          # Navigation with Citizenship & Incidents links
  /login-form.tsx           # Login with real API integration
  /animated-background.tsx  # Framer Motion animations
  /dashboard-display.tsx    # Dashboard components
```

## Key Features

✓ **PWA Support** - Installable as native app
✓ **Real Backend API** - Connected to security infrastructure
✓ **Session Management** - User roles, clearance levels, organizations
✓ **Framer Motion** - Smooth animations throughout
✓ **Modals** - Detailed views for citizenship & incidents
✓ **Charts & Analytics** - Real-time data visualization
✓ **Responsive Design** - Mobile & desktop optimized
✓ **Dark Theme** - 24/7 operations optimized interface
✓ **Token Management** - Auto-refresh with interceptors
✓ **Error Handling** - Graceful error states

## Testing Credentials

Test the system with these steps:
1. Go to `/` (login page)
2. Enter any valid email format (e.g., `officer@security.gov.ug`)
3. Enter any password
4. Backend will authenticate and return session
5. View dashboard with session information
6. Navigate between pages using sidebar
7. Click on citizenship or incidents to see detailed modals

## WebSocket Support

The API includes real-time support via Socket.io:
```
https://security-backend-dsya.onrender.com/api/v1
```

Events:
- `rfid-scan` - RFID reader events
- `security-alert` - Real-time security alerts
- `incident-update` - Incident status changes

## Environment Variables

Required for deployment:
- `NEXT_PUBLIC_API_URL` - Set to backend URL (already configured)
- `SERVICE_WORKER_ENABLED` - PWA service worker (enabled by default)

## Deployment

Deploy to Vercel with one click:
1. Connect GitHub repository
2. Deploy button in top right
3. PWA automatically configured
4. Service worker registered
5. Ready for production

## Support

For integration issues:
- Check API response in browser DevTools Network tab
- Verify access tokens in localStorage
- Check browser console for detailed error messages
- Ensure backend is running on expected URL
