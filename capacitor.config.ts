import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.wayfare.travel',
  appName: 'Wayfare Travel',
  webDir: 'public',
  server: {
    // Point to live site for production app
    url: 'https://travelwithwayfare.pages.dev',
    // Allow navigation within our domain
    androidScheme: 'https',
  },
  android: {
    allowMixedContent: false,
    backgroundColor: '#030712',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#030712',
      showSpinner: false,
      androidScaleType: 'CENTER_CROP',
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#030712',
    },
  },
};

export default config;
