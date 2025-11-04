# Tailwind CSS Setup

This project includes Tailwind CSS **for backend/admin pages only**. Frontend pages use SCSS.

## Configuration

- **[tailwind.config.ts](tailwind.config.ts)** - Tailwind configuration (scoped to backend paths)
- **[postcss.config.mjs](postcss.config.mjs)** - PostCSS configuration
- **[app/styles/tailwind.css](app/styles/tailwind.css)** - Separate Tailwind CSS file (import only in backend layouts)

## Important: Backend Only

Tailwind is configured to **only scan backend/admin directories**:
- `app/(admin)/**`
- `app/(dashboard)/**`
- `app/(auth)/**`
- `app/admin/**`
- `app/dashboard/**`
- `components/admin/**`
- `components/dashboard/**`

**Frontend pages will NOT include Tailwind styles** and should continue using SCSS modules.

## Usage

### Importing Tailwind in Backend Layouts

In your backend/admin layout file, import the Tailwind CSS:

```tsx
// app/(admin)/layout.tsx or app/admin/layout.tsx
import "@/styles/tailwind.css"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-gray-100">{children}</div>
}
```

### Basic Utility Classes

```tsx
// app/(admin)/dashboard/page.tsx
export default function AdminDashboard() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Admin Dashboard
        </h1>
        <p className="text-gray-600">
          Utility-first CSS framework for backend
        </p>
      </div>
    </div>
  )
}
```

### Responsive Design

```tsx
<div className="w-full md:w-1/2 lg:w-1/3">
  <p className="text-sm md:text-base lg:text-lg">
    Responsive text
  </p>
</div>
```

### Custom Colors

You can extend the theme in [tailwind.config.ts](tailwind.config.ts):

```typescript
theme: {
  extend: {
    colors: {
      primary: "#1a73e8",
      secondary: "#f50057",
    },
  },
}
```

Then use:

```tsx
<button className="bg-primary text-white hover:bg-primary/90">
  Click me
</button>
```

### Frontend vs Backend Styling

**Frontend pages** (public site):
```tsx
// app/about/page.tsx - Uses SCSS only
import styles from "./page.module.scss"

export default function About() {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>About Us</h1>
    </div>
  )
}
```

**Backend pages** (admin/dashboard):
```tsx
// app/(admin)/users/page.tsx - Uses Tailwind
export default function UsersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <div className="bg-white rounded-lg shadow p-6">
        {/* Admin content */}
      </div>
    </div>
  )
}
```

## VSCode Extension

Install the [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) extension for:
- Autocomplete
- Linting
- Hover previews
- Syntax highlighting

## Resources

- [Tailwind Documentation](https://tailwindcss.com/docs)
- [Tailwind UI Components](https://tailwindui.com/)
- [Tailwind Cheat Sheet](https://nerdcave.com/tailwind-cheat-sheet)

## Important Notes

- **Tailwind is isolated to backend/admin pages only**
- Frontend pages continue to use SCSS modules without any Tailwind interference
- Import `@/styles/tailwind.css` only in backend layout files
- Tailwind will only scan files in the configured backend directories
- This keeps frontend bundle size minimal and maintains separation of concerns
