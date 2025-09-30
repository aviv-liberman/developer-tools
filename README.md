# Developer Tools

Essential developer tools for JSON comparison, text case conversion, URL breakdown, and JSON analytics.

## Features

- **JSON Diff Tool**: Compare two JSON files or paste JSON content to see differences
- **Text Case Converter**: Convert text between various case formats (camelCase, PascalCase, snake_case, etc.)
- **URL Breakdown**: Analyze URLs and extract components (protocol, hostname, path, query parameters, etc.)
- **JSON Analytics**: Analyze JSON structure, validate format, and get detailed insights

## Production Setup

### Favicon Files

The project includes placeholder favicon files. To complete the setup:

1. Replace `favicon.ico` with a proper ICO file
2. Generate PNG favicons from `favicon.svg` using tools like:
   - [RealFaviconGenerator](https://realfavicongenerator.net/)
   - [Favicon.io](https://favicon.io/)

Required favicon sizes:
- 16x16px (favicon-16x16.png)
- 32x32px (favicon-32x32.png)
- 192x192px (favicon-192x192.png)
- 512x512px (favicon-512x512.png)
- 180x180px (apple-touch-icon.png)

### Meta Tags

The HTML includes comprehensive meta tags for:
- SEO optimization
- Social media sharing (Open Graph, Twitter Cards)
- Mobile optimization
- Security headers
- Performance optimization

### Accessibility

The application includes:
- Proper ARIA labels and roles
- Keyboard navigation support
- Semantic HTML structure
- Screen reader compatibility

## Deployment

This is a static HTML application that can be deployed to any web server or CDN. No build process is required.

### GitHub Pages Deployment

The application is currently deployed on GitHub Pages at: [https://aviv-liberman.github.io/developer-tools/](https://aviv-liberman.github.io/developer-tools/)

To deploy to GitHub Pages:
1. Push your code to a GitHub repository
2. Go to repository Settings → Pages
3. Select "Deploy from a branch" and choose your main branch
4. Your site will be available at `https://[username].github.io/[repository-name]/`

### Required Files for GitHub Pages

Make sure these files are in your repository root:
- `index.html` (main application)
- `favicon.ico` (or generated favicon files)
- `site.webmanifest` (PWA manifest)
- `favicon.svg` (source favicon)

## Browser Support

- Modern browsers with ES6+ support
- Mobile responsive design
- Touch-friendly interface
