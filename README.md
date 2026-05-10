# 🌿 Nutritive Harmony — Your Web App

Welcome to your personal Nutritive Harmony web app! This is a clean, fast, mobile-friendly site with PWA functionality (installable on phone home screens).

---

## 📁 What's in this folder

| File | What it does |
|---|---|
| `index.html` | Your main page (homepage of the app) |
| `diary.html` | Food diary request page |
| `intake.html` | Intake form page (placeholder until you add your form) |
| `styles.css` | All design and layout (cream + green branding) |
| `manifest.json` | Makes your site installable as a PWA |
| `service-worker.js` | Enables offline functionality |
| `logo.png` | Your logo image (you need to add this!) |
| `icons/icon-192.png` | App icon (192x192 — for home screen) |
| `icons/icon-512.png` | App icon (512x512 — for splash screen) |
| `README.md` | This guide |

---

## ⚡ QUICK START — Get it live in 30 minutes

### Step 1: Add your logo (5 min)

1. Take your `Logo_full.png` file (the Nutritive Harmony logo)
2. Rename it to **`logo.png`** (lowercase, exactly this)
3. Place it in this folder, replacing the empty placeholder

### Step 2: Add your app icons (10 min)

You need TWO square versions of your logo:

1. **icon-192.png** — 192×192 pixels (you can use https://favicon.io to resize)
2. **icon-512.png** — 512×512 pixels

Place both in the `icons/` folder.

**Quick way:** Open your logo in any free tool (Canva, Photoshop, Preview on Mac), resize to 512×512, save. Then resize the same image to 192×192 and save again. Both files go in `icons/`.

### Step 3: Upload to your hosting (10 min)

1. Log into your hosting provider's control panel
2. Find **File Manager** (usually labeled exactly that)
3. Navigate to **`public_html`** (or `www`, depending on host)
4. **Delete any existing index.html** if there's one
5. Upload ALL the files from this folder (drag & drop the whole contents)
6. Make sure the folder structure stays:
   ```
   public_html/
     ├── index.html
     ├── diary.html
     ├── intake.html
     ├── styles.css
     ├── manifest.json
     ├── service-worker.js
     ├── logo.png
     └── icons/
         ├── icon-192.png
         └── icon-512.png
   ```

### Step 4: Test it!

1. Visit **nutritiveharmony.com** in your browser
2. You should see your app! 🌿
3. Open it on your phone — try the "Add to Home Screen" feature

---

## 📅 Setting up Cal.com integration

Your "Book a session" button already points to **https://cal.eu/nutritiveharmony**. 

If you ever change your Cal.com URL:
1. Open `index.html` in any text editor (TextEdit, Notepad, VS Code)
2. Find this line:
   ```html
   <a href="https://cal.eu/nutritiveharmony" target="_blank" rel="noopener" class="tool-card tool-card-primary">
   ```
3. Replace the URL inside `href="..."` with your new one
4. Save and re-upload `index.html`

---

## 📋 Setting up the Intake form (when you're ready)

Once you've designed your intake form in Tally:

1. In Tally, click **Share** → **Embed**
2. Copy the iframe URL (looks like `https://tally.so/embed/abc123`)
3. Open `intake.html` in a text editor
4. Find this line:
   ```html
   <iframe src="about:blank" ...
   ```
5. Replace `about:blank` with your Tally URL
6. Save and re-upload `intake.html`

The placeholder message will automatically disappear once a real form URL is in place.

---

## 🍽️ Setting up the Food Diary form

Same process as the intake form, but for `diary.html`:

1. Build a Tally form with these fields:
   - **Your name** (short text, required)
   - **Preferred contact** (multiple choice: SMS / Email)
   - **Phone number** (short text, conditional on SMS choice)
   - **Email address** (email, conditional on Email choice)

2. In Tally Settings → Notifications → add `katerina@nutritiveharmony.com` to receive submissions

3. Get the embed URL and paste it into `diary.html` (same line: `<iframe src="about:blank" ...`)

---

## 📱 PWA: How clients install it on their phone

Once your site is live:

**On iPhone (Safari):**
1. Visit nutritiveharmony.com
2. Tap the **Share** button (square with arrow)
3. Scroll down → tap **Add to Home Screen**
4. Done — your app icon now sits next to other apps

**On Android (Chrome):**
1. Visit nutritiveharmony.com
2. Browser shows a banner: *"Add Nutritive Harmony to Home screen"*
3. Tap it
4. Done

When clients open the icon, your app loads full-screen — no browser bars, just your app. Like a native app. 🌿

---

## ✏️ Editing the content

All text on your site is in plain HTML. You can edit it with any text editor:

- **Mac:** TextEdit (set to plain text mode), or download free **VS Code**
- **Windows:** Notepad, or download free **VS Code**

To change wording:
1. Open the file (e.g. `index.html`)
2. Find the text you want to change
3. Edit it (be careful not to delete the `<tags>` around it!)
4. Save the file
5. Re-upload to your hosting

---

## 🎨 Brand colors (for reference)

If you ever want to tweak colors, find these in `styles.css`:

- **Cream background:** `#F4EFE9`
- **Leaf green (primary):** `#007A3F`
- **Wordmark olive:** `#3E661E`

---

## 🆘 Troubleshooting

**Q: My logo isn't showing**
→ Make sure the filename is exactly `logo.png` (lowercase). Check it's in the same folder as `index.html`.

**Q: The fonts look wrong**
→ The site loads fonts from Google. If you've blocked Google Fonts in your browser/region, fallback fonts will show.

**Q: PWA "Add to Home Screen" doesn't appear**
→ The site must be served over HTTPS (most hosting includes this free). Also check that `manifest.json`, `service-worker.js`, and the icon files are all uploaded correctly.

**Q: Form pages still show "coming soon" after I added Tally URL**
→ Make sure you replaced `about:blank` (and only that, leave the quote marks!) with your full Tally URL.

---

## 💚 Need to make changes later?

You can always come back and either:
- Edit the files yourself (very doable — they're well commented)
- Ask any AI assistant (Claude, ChatGPT) to help — paste the file content + your question
- Hire a freelancer for £20-30 if you want a bigger change

This site is built with **standard HTML/CSS** — readable by any developer, anywhere, forever.

---

## 🌱 What you've got

A real, professional, brand-on website that:
✅ Loads in under 1 second
✅ Works on any device
✅ Installs as an app on phones
✅ Costs £0 to maintain (beyond your hosting)
✅ Will outlive any platform or AI subscription
✅ Is yours forever

Welcome to having your own corner of the internet. 🌿

— Made with care
