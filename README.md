# hoyzn

## GitHub Pages

This project is configured to deploy using GitHub Pages. The Vite
configuration sets the base path to `/hoyzn/` so that built assets resolve
correctly when served from `https://<username>.github.io/hoyzn/`.

### Development

```bash
npm install
npm run dev
```

### Build

To create a production build:

```bash
npm run build
```

### Deployment

A workflow in `.github/workflows/gh-pages.yml` automatically builds and
publishes the contents of the `dist` directory to GitHub Pages whenever
changes are pushed to the `main` branch.

