# Publish Ravenswood Ledger with GitHub Pages

This folder is already a complete static site: `index.html` is the entry file and every stylesheet, script, and data file uses a relative path.

## Published site

- **Live app:** [https://tabaxi3000.github.io/clocktower-companion/](https://tabaxi3000.github.io/clocktower-companion/)
- **Source repository:** [https://github.com/Tabaxi3000/clocktower-companion](https://github.com/Tabaxi3000/clocktower-companion)

## First publication on another account

1. Create an empty GitHub repository, such as `clocktower-companion`. On a free GitHub account, make it public if you want to use GitHub Pages.
2. In Terminal, change into this folder and initialize the repository:

   ```bash
   cd "/Users/tabaxitft/Desktop/NOTES/Blood on the Clocktower/Clocktower Companion"
   git init
   git add .
   git commit -m "Publish Ravenswood Ledger"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/clocktower-companion.git
   git push -u origin main
   ```

3. Open the repository on GitHub and choose **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select **main**, choose **/(root)**, and save.
6. GitHub will publish the site at `https://YOUR-USERNAME.github.io/clocktower-companion/`.

## Later updates

```bash
cd "/Users/tabaxitft/Desktop/NOTES/Blood on the Clocktower/Clocktower Companion"
git add .
git commit -m "Update Ravenswood Ledger"
git push
```

Each push to `main` republishes the site. Check the repository's **Actions** tab if deployment is still running or fails.

## Data and privacy

The repository contains only the app and its public reference data. Do not add exported game JSON files: full exports can contain phone numbers, assigned roles, hidden setup, and private Storyteller notes.

Browser saves are origin-specific. Data saved while opening `index.html` locally will not automatically appear on the GitHub Pages URL. Use a full private JSON export/import if the Storyteller intentionally needs to move a game between those locations.

GitHub Pages sites are public even when some paid plans permit the source repository to be private. Use **Enforce HTTPS** in Pages settings when available.

## Official GitHub documentation

- [Creating a GitHub Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)
- [Configuring a publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
