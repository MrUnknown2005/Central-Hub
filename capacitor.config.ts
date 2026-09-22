import type { CapacitorConfig } from '@capacitor/cli'

/** Capacitor packages the built web app (`dist`) inside the APK and runs it in a
 *  native WebView. Only Supabase data calls go over the network — the UI shell
 *  itself is bundled, so the app opens without waiting on a server.
 *
 *  No `server.url` on purpose: this is a real installed app, not a wrapper that
 *  points at the live site. Because the app uses hash routing, the in-WebView
 *  origin only ever loads `index.html` and the router takes over — deep links and
 *  reloads work the same as on the web, with no native-side routing config. */
const config: CapacitorConfig = {
  appId: 'com.mlc.centralhub',
  appName: 'MLC Central Hub',
  webDir: 'dist',
}

export default config
