# PublicHoliday

Simple AI app to display what public holiday is today.

## 🚀 Live Demo

Visit the app at: [https://vassilatanasov.github.io/PublicHoliday/](https://vassilatanasov.github.io/PublicHoliday/)

## 📱 Features

- Modern Vue.js 3 web application
- **Native Android app support** via Capacitor
- Mobile-first responsive design with Tailwind CSS
- Real-time public holiday information
- Automatic deployment to GitHub Pages
- Clean, intuitive user interface

## 🛠️ Technology Stack

- **Vue.js 3** - Latest Vue framework with Composition API
- **Capacitor** - Native mobile app runtime
- **Tailwind CSS** - Modern utility-first CSS framework
- **Vite** - Lightning-fast build tool
- **TypeScript** - Type-safe development
- **GitHub Actions** - Automated CI/CD
- **GitHub Pages** - Free hosting

## 📸 Screenshot

![Public Holiday App](https://github.com/user-attachments/assets/762109c4-4f37-49b5-93d7-b9baff017deb)

## 🚦 Getting Started

### Web Application

Navigate to the `public-holiday-app` directory and follow the instructions in its README:

```bash
cd public-holiday-app
npm install
npm run dev
```

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

The app is automatically deployed to GitHub Pages when changes are pushed to the main branch. The deployment is handled by GitHub Actions.

### Setup GitHub Pages

1. Go to repository Settings → Pages
2. Under "Build and deployment", select "GitHub Actions" as the source
3. Push to the main branch to trigger deployment

## 📝 License

This project is open source and available under the MIT License.
