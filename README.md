# PublicHoliday

Simple AI app to display what public holiday is today.

## 🚀 Live Demo

Visit the app at: [https://vassilatanasov.github.io/PublicHoliday/](https://vassilatanasov.github.io/PublicHoliday/)

## 📱 Features

- Modern React web application deployed to GitHub Pages
- **Native Android app support** via Capacitor
- Mobile-first responsive design with Tailwind CSS
- Real-time public holiday information
- Automatic deployment to GitHub Pages
- Clean, intuitive user interface

## 🛠️ Technology Stack

- **React** - Component-based UI for the deployed web app
- **Vue.js 3** - Existing app retained in the repository for reference
- **Capacitor** - Native mobile app runtime
- **Tailwind CSS** - Modern utility-first CSS framework
- **Vite** - Lightning-fast build tool
- **JavaScript** - Current React learning app language
- **GitHub Actions** - Automated CI/CD
- **GitHub Pages** - Free hosting

## 📸 Screenshot

![Public Holiday App](https://github.com/user-attachments/assets/762109c4-4f37-49b5-93d7-b9baff017deb)

## 🚦 Getting Started

### Web Application

Navigate to the `public-holiday-react` directory and follow the instructions in its README:

```bash
cd public-holiday-react
npm install
npm run dev
```

The React app is now the GitHub Pages deployment target.

The existing Vue app remains in `public-holiday-app` as a reference implementation.

### 🤖 Android Native App

To build and run as a native Android application:

```bash
cd public-holiday-app
npm install
npm run android:build    # Build web app and sync to Android
npm run android:open     # Open in Android Studio
```

For detailed Android setup instructions, see [public-holiday-app/ANDROID.md](./public-holiday-app/ANDROID.md).

## 📦 Project Structure

```
PublicHoliday/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions deployment workflow
├── public-holiday-react/       # React GitHub Pages application
│   ├── src/
│   │   ├── App.jsx            # Main React application component
│   │   ├── components/        # React UI components
│   │   ├── hooks/             # React hooks
│   │   └── assets/            # Stylesheets and assets
│   ├── package.json
│   └── vite.config.js
├── public-holiday-app/         # Vue.js application
│   ├── android/               # Native Android project (Capacitor)
│   ├── src/
│   │   ├── App.vue            # Main application component
│   │   ├── main.ts            # Application entry point
│   │   └── assets/            # Stylesheets and assets
│   ├── capacitor.config.ts    # Capacitor configuration
│   ├── ANDROID.md            # Android setup guide
│   ├── package.json
│   └── vite.config.ts
├── ANDROID_CONVERSION_SUMMARY.md  # Detailed Android conversion info
└── README.md
```

## 🌐 Deployment

The React app in `public-holiday-react` is automatically deployed to GitHub Pages when changes are pushed to the main branch. The deployment is handled by GitHub Actions.

### Setup GitHub Pages

1. Go to repository Settings → Pages
2. Under "Build and deployment", select "GitHub Actions" as the source
3. Push to the main branch to trigger deployment

## 📝 License

This project is open source and available under the MIT License.
