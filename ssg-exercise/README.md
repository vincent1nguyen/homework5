# Homework 5 - Eleventy SSG Exercise

This project uses Eleventy to generate two portfolio pages:
Home and Projects.

Both pages share a footer defined in `src/_includes/footer.njk`.

## Installation
From the repository root:

```bash
cd ssg-exercise
npm install
```

## Build

```bash
npx @11ty/eleventy --input=src --output=_site
```

## Local Preview

```bash
npx @11ty/eleventy --serve --input=src --output=_site
```

Visit:
- Home: http://localhost:8080/
- Projects: http://localhost:8080/projects/

## Shared Footer

Both pages include `footer.njk` using Nunjucks.

Changing the shared footer and rebuilding updates both pages.