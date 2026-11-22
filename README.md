# SUNYUJIE Portfolio

React + Vite portfolio website for an overseas visual designer.

## Deploy with GitHub Pages

1. Create a new GitHub repository and upload all files in this folder.
2. Push the files to the `main` branch.
3. Open `Settings → Pages` in the repository.
4. Under `Build and deployment`, choose `GitHub Actions`.
5. After the workflow finishes, GitHub will provide the public website URL.

The included `.github/workflows/deploy.yml` builds the site and publishes it automatically after each push to `main` or `master`. The Vite configuration uses relative asset paths, so the site works both as a GitHub Pages project site and on a custom domain.

## Run locally

```bash
pnpm install
pnpm dev
```

The portfolio pages and animations are stored in `public/assets/`.
