# Star Wars Character Database

A responsive web application that displays Star Wars characters using the [SWAPI (Star Wars API)](https://swapi.dev/). Built with React, TypeScript, Tailwind CSS, and Vite.

🚀 **[Live Demo](https://starcharacter.vercel.app/)**

## How to Run the Project

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation & Running

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npm run dev
   ```

3. **Open your browser**
   Navigate to `http://localhost:5173`

4. **Login**
   Use any username and password (mock authentication)

### Other Commands
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## What I Implemented

### Core Requirements ✅
- **Character List Page** - Displays all Star Wars characters with pagination
- **Character Details** - Modal showing detailed information including:
  - Name, height, mass, birth year, gender
  - Hair color, eye color, skin color
  - Homeworld (name, terrain, climate, population)
  - Number of films appeared in
  - Date added to database (formatted)
- **Responsive Design** - Mobile-first approach using Tailwind CSS
- **Loading & Error States** - Proper handling of async operations

### Bonus Features ✅
- **Search** - Real-time character search by name (with 500ms debounce)
- **Advanced Filters** - Filter by homeworld, film, and species
- **Combined Search + Filters** - All filters work together simultaneously
- **Mock Authentication** - JWT token simulation with login/logout
- **Silent Token Refresh** - Auto-refreshes token before expiration (30s before)
- **Species-Based Colors** - Each character card has a unique color based on species
- **Keyboard Shortcuts** - ESC key closes modals

## Trade-offs & Design Choices

### Architecture Decisions

1. **Client-Side Filtering vs Server-Side**
   - **Choice:** Implemented client-side filtering for homeworld, film, and species
   - **Trade-off:** Filters only apply to current page's results (SWAPI limitation)
   - **Reasoning:** SWAPI doesn't support these filter parameters, and client-side provides instant feedback without additional API calls

2. **State Management**
   - **Choice:** Used React Context for auth, local state for everything else
   - **Trade-off:** Could use Redux/Zustand for more complex state
   - **Reasoning:** App complexity doesn't justify additional state management library; Context + useState keeps bundle size small and code maintainable

3. **Species Data Caching**
   - **Choice:** Implemented a Map-based cache for species data
   - **Trade-off:** Cache resets on page refresh
   - **Reasoning:** Reduces redundant API calls for same species; simple solution without persistence complexity

4. **Authentication Mock**
   - **Choice:** Full JWT simulation with expiry and refresh logic
   - **Trade-off:** Not real security, just demonstrates understanding
   - **Reasoning:** Shows proper auth flow patterns (token storage, refresh, expiry) applicable to real-world scenarios

5. **Image Handling**
   - **Choice:** Used random placeholder images via unsplash
   - **Trade-off:** Images don't match actual characters
   - **Reasoning:** SWAPI doesn't provide images; placeholders give visual variety while keeping UI engaging

### Technical Choices

1. **TypeScript** - Full type safety prevents runtime errors and improves developer experience
2. **Tailwind CSS 4** - Utility-first approach enables rapid UI development without CSS files
3. **Vite** - Fast HMR and build times compared to Create React App
4. **date-fns** - Lightweight date formatting (compared to moment.js)
5. **Component Structure** - Small, focused components for reusability and testability

### Performance Optimizations

1. **Debounced Search** - 500ms delay prevents excessive API calls while typing
2. **useMemo for Filtered Results** - Prevents unnecessary recalculations
3. **Species Cache** - Reduces API calls for repeated species lookups
4. **Lazy Loading** - Pagination naturally limits rendered elements

### UX Decisions

1. **Modal for Details** - Keeps user in context instead of navigation
2. **Visual Feedback** - Loading spinners, error messages, and hover effects
3. **Accessible** - Keyboard navigation (ESC), semantic HTML, ARIA labels
4. **Color Coding** - Species-based colors for quick visual identification

### Known Limitations

1. Filters only work on current page results (SWAPI API constraint)
2. Search pagination shows "Page X of Y" based on filtered count, not total
3. Images are random placeholders, not actual character photos
4. Token stored in localStorage (would use httpOnly cookies in production)

### Login Credentials
```
Username: luke
Password: skywalker
```

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Run tests once (CI mode):
```bash
npm run test:run
```

Run tests with UI:
```bash
npm run test:ui
```

## 📦 Build for Production

Build the project:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## 🛠️ Tech Stack

- **React 19.2.0** - UI library with hooks and functional components
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Testing Library** - Testing utilities
- **Vitest** - Fast unit test framework
- **date-fns** - Date formatting library
- **SWAPI** - Star Wars API for character data
- **Picsum Photos** - Random images for character cards

## 📁 Project Structure

```
star-wars-app/
├── src/
│   ├── components/          # React components
│   │   ├── CharacterCard.tsx
│   │   ├── CharacterModal.tsx
│   │   ├── ErrorMessage.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── LoginForm.tsx
│   │   ├── Pagination.tsx
│   │   └── SearchFilters.tsx
│   ├── context/             # React context
│   │   └── AuthContext.tsx  # Authentication logic
│   ├── services/            # API services
│   │   └── api.ts           # SWAPI integration
│   ├── types/               # TypeScript types
│   │   └── index.ts
│   ├── utils/               # Helper functions
│   │   └── helpers.ts
│   ├── test/                # Test files
│   │   ├── setup.ts
│   │   └── CharacterModal.test.tsx
│   ├── App.tsx              # Main app component
│   ├── App.css              # App styles
│   ├── index.css            # Global styles
│   └── main.tsx             # App entry point
├── public/                  # Static assets
├── index.html               # HTML template
├── tailwind.config.js       # Tailwind configuration
├── vite.config.ts           # Vite configuration
├── vitest.config.ts         # Vitest configuration
└── package.json             # Dependencies
```

## 🎨 Key Features Explained

### Authentication
- Mock JWT token generation and validation
- Silent token refresh (refreshes when < 5 minutes remaining)
- Session persistence using localStorage
- Automatic logout on token expiration

### Search & Filters
- **Search**: Real-time character name search with 500ms debounce
- **Homeworld Filter**: Filter by character's home planet
- **Film Filter**: Filter by movie appearance
- **Species Filter**: Filter by character species
- **Combined Filtering**: All filters work together

### Character Cards
- Random images from Picsum Photos (seeded by character ID)
- Color-coded by species (37 different species colors)
- Hover effects with scale animation
- Display key info: name, birth year, gender, film count

### Character Modal
- Full character details
- Homeworld information with loading state
- Formatted data (height in meters, mass in kg, formatted dates)
- Keyboard support (ESC to close)
- Click outside to close
- Responsive layout

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Grid layout: 1 column (mobile) → 4 columns (desktop)
- Touch-friendly buttons and interactions

## 🧪 Testing

The project includes integration tests for the character modal functionality:
- Verifies modal opens when clicking a character card
- Checks correct character details are displayed
- Validates homeworld data loading
- Tests modal closing functionality

## 📝 License

This project is open source and available for educational purposes.

## 🙏 Acknowledgments

- [SWAPI](https://swapi.dev/) - The Star Wars API
- [Picsum Photos](https://picsum.photos/) - Random placeholder images
- [Tailwind CSS](https://tailwindcss.com/) - For the excellent utility-first CSS framework
