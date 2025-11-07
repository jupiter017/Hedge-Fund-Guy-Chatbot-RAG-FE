# Frontend - React + TypeScript + Vite

Modern, responsive, **type-safe** frontend for the Insomniac Hedge Fund Guy chatbot system.

## Features

- ⚡ **Fast**: Built with Vite for lightning-fast HMR
- 🔷 **TypeScript**: Full type safety and IntelliSense support
- 🎨 **Modern UI**: Beautiful gradient design with glass morphism effects
- 📱 **Responsive**: Works perfectly on desktop, tablet, and mobile
- 🔄 **Real-time**: WebSocket integration for instant messaging
- ✨ **Animations**: Smooth transitions and micro-interactions
- 🎯 **Progress Tracking**: Visual data collection progress
- 🌙 **Dark Theme**: Sleek dark design with purple/blue gradients

## Tech Stack

- **React 18**: Latest React with hooks
- **TypeScript 5.3**: Full type safety
- **Vite**: Next-generation frontend tooling
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client for API calls
- **WebSockets**: Real-time bidirectional communication
- **Lucide Icons**: Beautiful, consistent icons
- **React Markdown**: Render markdown in messages

## Installation

```bash
cd frontend
npm install
```

## Development

```bash
npm run dev
```

Open http://localhost:3000

## Type Checking

```bash
npm run type-check
```

## Build for Production

```bash
npm run build
```

The build output will be in the `dist` directory.

## Preview Production Build

```bash
npm run preview
```

## Project Structure

```
frontend/
├── public/               # Static assets
├── src/
│   ├── components/      # React components (TypeScript)
│   │   ├── Header.tsx
│   │   ├── ChatInterface.tsx
│   │   ├── Message.tsx
│   │   ├── DataCollectionProgress.tsx
│   │   ├── SessionInfo.tsx
│   │   └── Toast.tsx
│   ├── services/        # API services
│   │   └── api.ts
│   ├── types/           # TypeScript type definitions
│   │   └── index.ts
│   ├── App.tsx          # Main App component
│   ├── main.tsx         # Entry point
│   ├── index.css        # Global styles
│   └── vite-env.d.ts    # Vite type definitions
├── index.html           # HTML template
├── package.json         # Dependencies
├── tsconfig.json        # TypeScript configuration
├── tsconfig.node.json   # TypeScript Node configuration
├── vite.config.ts       # Vite configuration
├── tailwind.config.js   # Tailwind configuration
└── postcss.config.js    # PostCSS configuration
```

## TypeScript Benefits

### Type Safety
All components, props, and API responses are fully typed, catching errors at compile time instead of runtime.

### IntelliSense
Get autocomplete and inline documentation in your IDE for better developer experience.

### Refactoring
Safely refactor code with confidence that TypeScript will catch any breaking changes.

### Documentation
Types serve as inline documentation, making the codebase easier to understand.

## Type Definitions

### Core Types

```typescript
interface SessionInfo {
  session_id: string
  timestamp: string
  status: 'active' | 'complete'
}

interface DataCollected {
  name: boolean
  email: boolean
  income: boolean
}

interface Message {
  id: number
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}
```

See `src/types/index.ts` for all type definitions.

## Components

### Header
Top navigation bar with branding and status indicators.

### ChatInterface
Main chat component with WebSocket connection, message display, and input field.
- Fully typed props
- Type-safe WebSocket event handling
- Proper state typing

### Message
Individual message bubble with markdown rendering and timestamp.

### DataCollectionProgress
Visual progress tracker showing which data fields have been collected.

### SessionInfo
Sidebar component displaying current session information.

### Toast
Notification component for success/error messages.

## API Integration

The frontend communicates with the backend via:

1. **REST API** (axios with TypeScript):
   ```typescript
   const session = await createSession() // Returns typed SessionInfo
   ```

2. **WebSocket** (native WebSocket API with typed messages):
   ```typescript
   interface WebSocketMessage {
     type: 'greeting' | 'message' | 'email_sent'
     message: string
     data_collected?: DataCollected
     is_complete?: boolean
   }
   ```

## Environment Variables

Create a `.env` file (optional):

```env
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
```

Type definitions are in `src/vite-env.d.ts`.

## Styling

### Tailwind CSS
Utility-first CSS framework with custom configuration for:
- Custom color palette (primary, accent)
- Gradient text utilities
- Glass morphism effects
- Custom animations

### Custom Classes
- `.glass-effect`: Glass morphism backdrop
- `.gradient-text`: Gradient text effect
- `.chat-message`: Message styling
- `.btn-primary`: Primary button style
- `.input-field`: Input field styling

## TypeScript Configuration

### tsconfig.json
Main TypeScript configuration with:
- Strict mode enabled
- React JSX transform
- Path aliases (`@/*`)
- Modern ES target

### tsconfig.node.json
Configuration for Vite config file

## Development Tips

### Type Checking
Run type checking without building:
```bash
npm run type-check
```

### ESLint
Lint your code:
```bash
npm run lint
```

### Hot Module Replacement
Changes to TypeScript files trigger fast HMR without full page reload.

## Common TypeScript Patterns

### Component Props
```typescript
interface MyComponentProps {
  title: string
  count?: number // Optional
  onUpdate: (value: string) => void
}

export default function MyComponent({ title, count = 0, onUpdate }: MyComponentProps) {
  // ...
}
```

### State with Types
```typescript
const [data, setData] = useState<DataCollected>({
  name: false,
  email: false,
  income: false,
})
```

### Event Handlers
```typescript
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault()
  // ...
}

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setValue(e.target.value)
}
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Code splitting with Vite
- Lazy loading of components
- Optimized bundle size
- Fast initial load time
- Type checking doesn't affect runtime performance

## Troubleshooting

### Type Errors
```bash
# Check for type errors
npm run type-check

# Common fix: delete node_modules and reinstall
rm -rf node_modules
npm install
```

### Port Already in Use
```bash
npm run dev -- --port 3001
```

### Build Errors
```bash
# Clean build
rm -rf dist
npm run build
```

### WebSocket Connection Failed
Check that the backend is running on port 8000.

## Deployment

### Vercel (Recommended)
```bash
vercel
```

### Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

### Docker
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
```

## Migration from JavaScript

This project has been fully migrated from JavaScript to TypeScript:
- ✅ All `.jsx` files converted to `.tsx`
- ✅ All `.js` files converted to `.ts`
- ✅ Type definitions added for all components
- ✅ API responses fully typed
- ✅ Props interfaces defined
- ✅ Event handlers properly typed
- ✅ State management typed
- ✅ Full IntelliSense support

## License

Part of the Insomniac Hedge Fund Guy assessment project.
