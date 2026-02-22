# Release Checklist Tool - Frontend

A modern, responsive web application for managing software release checklists. Built with React, TypeScript, and Material-UI.

## 🚀 Features

- **Release Management**: Create, view, edit, and delete software releases
- **Interactive Checklists**: Track release progress with customizable checklist items
- **Real-time Status**: Auto-calculated status (Planned, Ongoing, Done) based on completion
- **Progress Tracking**: Visual progress indicators with percentage completion
- **Responsive Design**: Optimized for desktop and mobile devices
- **Modern UI**: Clean interface using Material-UI components

## 📋 Checklist Items

Each release tracks the following tasks:
- All relevant GitHub pull requests merged
- CHANGELOG.md files updated
- All tests passing
- GitHub releases created
- Deployed to demo environment
- Tested in demo environment
- Deployed to production

## 🛠️ Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Material-UI (MUI)** - Component library
- **React Router** - Client-side routing
- **Bun** - Package manager and runtime

## 📦 Installation

1. **Install dependencies:**
   ```bash
   bun install
   ```

2. **Configure environment variables:**
   
   Create a `.env` file in the frontend directory (optional):
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
   
   If not set, defaults to `http://localhost:5000/api`

## 🏃 Running the Application

### Development Mode

Start the development server with hot module replacement:

```bash
bun run dev
```

The application will be available at `http://localhost:5173`

### Production Build

Build the application for production:

```bash
bun run build
```

Preview the production build:

```bash
bun run preview
```

## 📁 Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── assets/         # Images, fonts, etc.
│   ├── components/     # React components
│   │   ├── common/    # Shared components (BreadcrumbNav)
│   │   ├── release/   # Release-specific components
│   │   │   ├── NewRelease.tsx    # Create release form
│   │   │   └── ViewRelease.tsx   # View/Edit release
│   │   ├── Home.tsx              # Home page
│   │   ├── Releases.tsx          # Releases table
│   │   └── index.ts              # Component exports
│   ├── services/       # API service layer
│   │   └── api.ts     # API client and types
│   ├── App.tsx        # Main app component
│   ├── main.tsx       # App entry point
│   └── App.css        # Global styles
├── index.html         # HTML template
├── package.json       # Dependencies
├── tsconfig.json      # TypeScript config
└── vite.config.ts     # Vite configuration
```

## 🎯 Key Components

### Home Page (`/`)
- Displays all releases in a table
- Shows release name, version, date, status, and progress
- Quick actions: View and Delete releases
- Create new release button

### New Release (`/releases/new`)
- Form to create a new release
- Input fields: Release name, version, date, remarks
- Checklist with 7 customizable items
- Auto-calculates progress percentage

### View Release (`/releases/:id`)
- View detailed release information
- Edit mode for updating release details and checklist
- Real-time progress tracking
- Delete release functionality

## 🔌 API Integration

The frontend communicates with the backend API through the `apiService`:

```typescript
import { apiService } from './services/api';

// Get all releases
const releases = await apiService.getAllReleases();

// Get single release
const release = await apiService.getReleaseById(id);

// Create release
const newRelease = await apiService.createRelease(data);

// Update release
const updated = await apiService.updateRelease(id, data);

// Delete release
await apiService.deleteRelease(id);
```

## 🎨 Status Colors

Releases are automatically categorized by status:

- **Planned** (Gray) - No checklist items completed (0%)
- **Ongoing** (Orange) - Some items completed (1-99%)
- **Done** (Green) - All items completed (100%)

## 🧪 Type Safety

All API responses and component props are fully typed:

```typescript
interface Release {
  id: number;
  releaseName: string;
  version: string;
  releaseDate: string;
  remarks: string | null;
  checklist: Checklist;
  checklistProgress: ChecklistProgress;
  createdAt: string;
  updatedAt: string;
}
```

## 🔧 Development Tools

- **ESLint** - Code linting
- **TypeScript** - Static type checking
- **Vite HMR** - Hot Module Replacement for fast development
- **React DevTools** - Recommended for debugging

## 📝 Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run preview` - Preview production build
- `bun run lint` - Run ESLint

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Ensure backend server is running on `http://localhost:5000`
2. Make changes to components or services
3. Test thoroughly in development mode
4. Build and preview before committing

## 📄 License

ISC

## 🔗 Related

- [Backend Repository](../backend/README.md)
- [Material-UI Documentation](https://mui.com/)
- [React Router Documentation](https://reactrouter.com/)

