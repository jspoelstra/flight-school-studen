# SkyWings Academy - Flight School Student Record Management System

Always follow these instructions first and only fall back to search or bash commands when you encounter unexpected information that does not match the info here.

## Working Effectively

### Bootstrap and Setup
- Install dependencies: `npm install` - takes 2 minutes. NEVER CANCEL. Set timeout to 5+ minutes.
- Node.js version: v20.19.4 (verified compatible)
- Package manager: npm v10.8.2

### Build and Test the Application
- **Build**: `npm run build` - takes 15 seconds. NEVER CANCEL. Set timeout to 2+ minutes.
  - Uses TypeScript compiler with `tsc -b --noCheck` followed by Vite production build
  - Output: `dist/` directory with optimized assets
  - Note: Build includes warnings about large chunks (629.86 kB) - this is normal
  - **Build artifacts**: Creates `dist/index.html`, CSS, and JS bundles
- **Linting**: `npm run lint` - BROKEN - missing eslint.config.js file. DO NOT rely on linting.
- **Development server**: `npm run dev` - starts immediately on http://localhost:5000/
- **Preview built app**: `npm run preview` - serves built app on http://localhost:4173/

### Key Application Functionality
- **Authentication**: Role-based login system with three user types
- **Demo Credentials** (IMPORTANT - auth emails differ from display):
  - Admin: `admin@flightschool.com` / `password`
  - Instructor: `instructor@flightschool.com` / `password` 
  - Student: `student@flightschool.com` / `password`
  - **Note**: Login form displays `@skywings.com` but actual auth uses `@flightschool.com`

### Manual Validation Requirements
- **ALWAYS test login flow** after making authentication changes
- **ALWAYS verify role-based dashboards** load correctly for each user type
- **Test complete user scenario**: Login → Navigate dashboard → Verify role-specific features
- **Known issue**: KV storage errors in console (403 Forbidden) - these are expected and don't break functionality

## Project Structure

### Key Directories and Files
- **Root**: `/home/runner/work/flight-school-studen/flight-school-studen/`
- **Source**: `src/` - All React/TypeScript components
- **Components**: `src/components/` - UI components organized by feature
  - `auth/` - Login and authentication
  - `dashboard/` - Role-specific dashboards (admin, instructor, student)
  - `layout/` - App layout and navigation
  - `ui/` - Reusable UI components
- **Main files**:
  - `src/App.tsx` - Main app component with role routing
  - `src/lib/auth.tsx` - Authentication context and mock users
  - `src/lib/types.ts` - TypeScript type definitions
  - `package.json` - Dependencies and scripts
  - `vite.config.ts` - Vite configuration
  - `tsconfig.json` - TypeScript configuration

### Technology Stack
- **Framework**: React 19 with TypeScript
- **Build tool**: Vite 6.3.5 with SWC for fast compilation
- **UI Framework**: GitHub Spark (@github/spark) with Radix UI components
- **Styling**: Tailwind CSS 4.1.11
- **Icons**: Phosphor Icons (@phosphor-icons/react)
- **State management**: React Context (for auth)

## Common Development Tasks

### Making Changes
- **Always run the development server**: `npm run dev` to see changes in real-time
- **Authentication changes**: Test with all three user roles
- **UI changes**: Test responsive behavior and dark/light themes
- **Before committing**: Run `npm run build` to ensure production build works

### Debug Common Issues
- **Login fails**: Verify using `@flightschool.com` emails, not `@skywings.com`
- **Icons missing**: Phosphor icons proxy system converts missing icons to "Question" - check console for proxied imports
- **Build warnings**: Large bundle size warnings are expected due to comprehensive component library
- **KV storage errors**: 403 Forbidden errors in console are expected - app works without external storage

### File Change Impact
- **Component changes**: Instant reload in dev mode
- **Type changes**: May require restart of TypeScript server
- **Config changes**: Restart dev server with `npm run dev`
- **Authentication logic**: Always test all three user roles after changes

## Validation Scenarios

### Complete End-to-End Testing
1. **Admin Login Test**: Login as admin → Verify "Flight Operations Command" dashboard loads → Check student/instructor metrics
2. **Instructor Login Test**: Login as instructor → Verify "Flight Instructor Command Center" loads → Check student list and flight reports
3. **Student Login Test**: Login as student → Verify student-specific dashboard loads → Check progress tracking
4. **Navigation Test**: Use sidebar navigation to switch between sections
5. **Logout Test**: Sign out and verify return to login screen

### Expected Build Output
```
npm run build output:
- TypeScript compilation: Success
- Vite build: ~10 seconds
- Bundle size warning: Normal (629.86 kB JS, 377.68 kB CSS)
- Output: dist/ directory ready for deployment
```

### Expected Dev Server Output
```
npm run dev output:
- Vite dev server: Starts in ~732ms
- Local URL: http://localhost:5000/
- Icon proxy: Loads 1533 Phosphor icons
- Hot reload: Enabled for instant development
```

## Important Notes
- **NO TESTING FRAMEWORK**: This project has no unit tests or test runner
- **NO CI/CD**: No GitHub Actions workflows for automated testing
- **NO ESLINT CONFIG**: Linting is broken - do not depend on `npm run lint`
- **MOCK DATA**: All data is hardcoded - no real backend integration
- **KV STORAGE**: External storage calls fail (expected) - app uses local state
- **ICON PROXYING**: Missing icons automatically fallback to "Question" icon

## Debugging Tips
- **Console errors about fonts/external resources**: Expected due to sandboxed environment
- **KV storage 403 errors**: Expected - app functions without external storage
- **Build chunk size warnings**: Normal due to large component library
- **Hot reload not working**: Restart dev server with Ctrl+C then `npm run dev`

Remember: This is a comprehensive flight training management application with professional aviation UI/UX design. Changes should maintain the aviation theme and role-based access patterns.