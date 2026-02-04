# Public Holiday App

A modern, mobile-first web application built with Vue.js 3 and Tailwind CSS that displays current public holiday information.

## Features

- 🎉 Displays public holiday information from an API
- 📱 Mobile-first responsive design using Tailwind CSS
- ⚡ Built with Vue.js 3 and Vite for optimal performance
- 🎨 Modern, gradient-based UI with smooth animations
- ♻️ Real-time data fetching with retry capability
- 🌐 Deployed on GitHub Pages

## Live Demo

Visit the live app at: [https://vassilatanasov.github.io/PublicHoliday/](https://vassilatanasov.github.io/PublicHoliday/)

## API Integration

The app calls a POST endpoint to fetch public holiday data:
```
https://funcapp-hnn5vijj5yj7e.azurewebsites.net/api/Function1
```

The response format:
- First line: Displayed as the title
- Remaining lines: Displayed as the description

## Screenshots

![Public Holiday App](https://github.com/user-attachments/assets/762109c4-4f37-49b5-93d7-b9baff017deb)

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Preview Production Build

```sh
npm run preview
```

## Deployment

The app is automatically deployed to GitHub Pages using GitHub Actions when changes are pushed to the main branch.

### GitHub Pages Setup

1. Go to your repository Settings → Pages
2. Select "GitHub Actions" as the source
3. The deployment workflow will run automatically on push to main

### Manual Deployment

To manually deploy:

1. Build the project:
   ```sh
   npm run build
   ```

2. The `dist` folder will contain the production build

3. Deploy the contents of `dist` to your hosting provider

## Technology Stack

- **Vue.js 3** - Progressive JavaScript framework
- **Vite** - Next generation frontend tooling
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Type-safe JavaScript
- **GitHub Actions** - CI/CD pipeline
- **GitHub Pages** - Hosting

## Browser Support

Modern browsers with ES6+ support:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is open source and available under the MIT License.
