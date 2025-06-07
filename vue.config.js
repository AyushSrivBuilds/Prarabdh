const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  pwa: {
    name: 'Sampark PWA',
    short_name: 'Sampark',
    themeColor: '#4DBA87', // Matches manifest.json
    msTileColor: '#000000',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    start_url: '.', // Matches manifest.json
    display: 'standalone', // Matches manifest.json
    background_color: '#ffffff', // Matches manifest.json
    description: 'A Progressive Web App for Sampark.', // Matches manifest.json
    icons: [ // This might be redundant if public/manifest.json is preferred by the plugin
      {
        src: './img/icons/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: './img/icons/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ],
    // Configure Workbox service worker generation
    workboxPluginMode: 'GenerateSW', // Default, generates a service worker
    workboxOptions: {
      // You can add more Workbox options here if needed
      // For example, to skip waiting and claim clients immediately:
      // skipWaiting: true,
      // clientsClaim: true,
    }
  }
})
