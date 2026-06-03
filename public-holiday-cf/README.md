# public-holiday-cf

React frontend that uses the external MCP backend at `https://holidays-app.v-atanasov.workers.dev`.

To run locally:

```bash
cd public-holiday-cf
npm install
npm run dev
```

Add the PWA by installing to a device or opening via `npm run preview` after `npm run build`.

## Deploy to GitHub Pages

Build the production bundle and publish the `dist/` directory to a `gh-pages` branch (this repo is published at `https://vassilatanasov.github.io/PublicHoliday/`):

From the repository root run:

```bash
# 1) Build the app
cd public-holiday-cf
npm install    # only needed once
npm run build

# 2) Publish the built `dist/` to the gh-pages branch (force-update)
git add -A
git commit -m "Prepare deploy" || true
git push origin --delete gh-pages || true
git subtree push --prefix public-holiday-cf/dist origin gh-pages

# After this, GitHub Pages will serve the site at:
# https://<your-username>.github.io/<repository>/
# e.g. https://vassilatanasov.github.io/PublicHoliday/
```

Alternative (using the `gh-pages` npm package):

```bash
cd public-holiday-cf
npm install --save-dev gh-pages
# add to package.json scripts: "deploy": "gh-pages -d dist -b gh-pages"
npm run build
npm run deploy
```

Notes:
- Replace `vassilatanasov/PublicHoliday` with your repository if different.
- Using `git subtree push` is simple and does not require additional packages.
