<!-- Generated by SpecStory -->

# Add links to HTML head section (2025-06-02 06:01:36)

_**User**_

I need to add these links to the head of the html:
---
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="manifest" href="/site.webmanifest">

---

_**Assistant**_



---

I'll help you add those favicon and manifest links to the HTML head. First, let me check the current working directory and then update the layout file.

---

```bash
pwd
```

```
Liams-MacBook-Pro-2021:restaurant-passport-app liamellis$ pwd
/Users/liamellis/Desktop/restaurant-passport-app
Liams-MacBook-Pro-2021:restaurant-passport-app liamellis$
```

---

Perfect! Now I'll update the layout file to include those favicon and manifest links in the metadata object. In Next.js 13+ with the app router, the best practice is to add these links through the metadata configuration.

---



---

Perfect! I've added the favicon and manifest links to your Next.js layout using the `metadata` object. Here's what I added:

- **`icons.icon`**: Contains the PNG favicon links for 16x16 and 32x32 sizes
- **`icons.apple`**: Contains the Apple touch icon for 180x180 size
- **`manifest`**: Points to your web app manifest file

This approach is the recommended way to handle favicons and manifest files in Next.js 13+ with the app router. Next.js will automatically generate the appropriate `<link>` tags in the HTML head based on this metadata configuration.

The links will be rendered as:
- `<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">`
- `<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">`
- `<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">`
- `<link rel="manifest" href="/site.webmanifest">`

Make sure you have the corresponding favicon files in your `public` directory for these links to work properly.

---

