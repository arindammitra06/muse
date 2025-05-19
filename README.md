## About
![Screenshot](./assets/screenshot.png)

A modern, open-source music player built with React, focused on seamless mobile playback and inspired by the Flutter-based BlackHole app.

Designed for personal use, it offers a responsive, immersive experience across devices. Contributions are welcome!

We do not support or promote piracy in any form. This project is created strictly for educational and personal use. It serves as a learning tool for developers interested in building music applications with modern web technologies.

Please respect artists and copyright laws by streaming music only through legal and authorized sources.

## 🚀 Features

- 🎵 **Mark Favorites** – Easily mark and access your favorite tracks anytime.
- ☁️ **Cloud Sync with Firebase** – Your playlists are automatically synced across devices using Firebase.
- 📴 **Offline Playback** – Enjoy your music even without an internet connection.
- ⏲️ **Sleep Timer** – Auto-stop playback after a custom duration, perfect for bedtime listening.
- 🔍 **Music Search** – Quickly find songs from a vast indexed catalog.
- 🏠 **Beautiful Homepage** – Discover trending tracks on an eye-catching, mobile-first homepage.
- 🌙 **Dark Mode** – Built-in dark theme for a soothing experience at night.
- 🎨 **Custom Primary Colors** – Personalize the UI with your preferred accent colors.
- 🧠 **Session-Based Playback** – Keeps track of your listening session until manually stopped.
- 🎚️ **Custom Quality Controls** – Stream or download in your chosen quality (Low / Medium / High).
- 📱 **Mobile-First Design** – UI optimized for smooth playback on small screens.
- 📦 **Progressive Web App** – Install and run like a native app on any device.
- 💻 **Open Source & Self-Hosted** – 100% free and open. Host it on your own server with full control.

Checkout the demo play but restrain from heavy usage as it might get you blacklisted. If you want a copy of your personal music player, follow along...

 1. Fork repository.
 2. Setup your firebase account. Add firestore & authentication to be used for saving playlists.
 3. Link project to Vercel
 4. Add environment variables ->
	
		NEXT_PUBLIC_FIREBASE_API_KEY=******
    	NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=******
    	NEXT_PUBLIC_FIREBASE_PROJECT_ID=******
    	NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=******
    	NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=******
    	NEXT_PUBLIC_FIREBASE_APP_ID=******
    	NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=******
		<!-- Get Client ID and Secret from Spotify if you want to turn on Lyrics. This is experimental but works as of now-->
		NEXT_PUBLIC_SPOTIFY_CLIENT_ID= **********
		NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET=*********
5. Voila... you have your personal copy of music player.


Or instead deploy directly to Vercel with your Firebase Keys...

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/arindammitra06/muse&env=NEXT_PUBLIC_FIREBASE_API_KEY,NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,NEXT_PUBLIC_FIREBASE_PROJECT_ID,NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,NEXT_PUBLIC_FIREBASE_APP_ID,NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,NEXT_PUBLIC_SPOTIFY_CLIENT_ID,NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET)

### Don't forget to ⭐ the repo


## License

```
Copyright © 2025 Arindam Mitra

muse is a free software licensed under GPL v3.0
It is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

```

```
Being Open Source doesn't mean you can just make a copy of the app and upload it on playstore or sell
a closed source copy of the same.
Read the following carefully:
1. Any copy of a software under GPL must be under same license. So you can't upload the app on a closed source
  app repository like PlayStore/AppStore without distributing the source code.
2. You can't sell any copied/modified version of the app under any "non-free" license.
   You must provide the copy with the original software or with instructions on how to obtain original software,
   should clearly state all changes, should clearly disclose full source code, should include same license
   and all copyrights should be retained.

In simple words, You can ONLY use the source code of this app for `Open Source` Project under `GPL v3.0` or later
with all your source code CLEARLY DISCLOSED on any code hosting platform like GitHub, with clear INSTRUCTIONS on
how to obtain the original software, should clearly STATE ALL CHANGES made and should RETAIN all copyrights.
Use of this software under any "non-free" license is NOT permitted.

```

See the  [GNU General Public License](https://github.com/arindammitra06/muse/LICENSE)  for more details.


## Facing any Issue?

Have a look at some  [common Issues](https://github.com/arindammitra06/muse/issues)  that you might face. If your problem is not there, feel free to open an Issue :)