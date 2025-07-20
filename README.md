# Live Score Board Application

A real-time football match scoreboard application built with React, TypeScript, and modern development practices. Track ongoing World Cup matches with live score updates, match management, and an intuitive user interface.

Approach to the task:

- **Frontend**: React 19 with TypeScript
- **Styling**: Tailwind CSS for utility-first styling
- **Build Tool**: Vite for fast development and building
- **Testing**: Vitest with React Testing Library
- **Linting**: ESLint with TypeScript support

## 🔧 Development Decisions Explained

### Why Custom Hooks?
- **Reusability**: Logic can be shared across components
- **Testability**: Easier to unit test isolated business logic
- **Separation**: UI and business logic are decoupled

### Why Reducer Pattern for ScoreBoard?
- **Predictability**: All state changes go through defined actions
- **Debugging**: Easy to trace state changes
- **Testing**: Pure functions are straightforward to test

### Why Tailwind CSS?
- **Consistency**: Utility classes ensure design consistency
- **Performance**: Only used styles are included in the bundle
- **Maintainability**: No CSS naming conflicts or specificity issues

### Why Vitest over Jest?
- **Speed**: Faster test execution with native ES modules
- **Integration**: Better integration with Vite build tool
- **Developer Experience**: Hot module replacement for tests

### Available Scripts

```bash
npm run dev
npm run build
npm run test
npm run test:ui
npm run test:coverage
npm run lint
```

The application includes comprehensive tests covering:

- **Hook Logic**: [`useScoreBoard.test.ts`](src/tests/useScoreBoard.test.ts)
- **Component Behavior**: [`LiveScoreBoard.test.tsx`](src/tests/LiveScoreBoard.test.tsx)
- **Form Validation**: [`AddMatchForm.test.tsx`](src/tests/AddMatchForm.test.tsx)
- **UI Components**: [`Button.test.tsx`](src/tests/Button.test.tsx), [`Input.test.tsx`](src/tests/Input.test.tsx)

