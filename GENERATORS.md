# Code Generators

This project uses [Plop.js](https://plopjs.com/) to generate components, features, and pages.

## Using the Generators

Run the generator with:

```bash
bun run generate
# or
npm run generate
```

Then select the type of generator you want to use:

- `component` - Creates a new UI component
- `feature` - Creates a new feature with its main component
- `page` - Creates a new Next.js page

## Component Generator

Creates a new component in `src/components/{type}/`.

Prompts:
- **name**: The name of the component
- **type**: The type of component (ui, kokonutui, magicui, admin, qr-code)

Example output for a Button component of type 'ui':
```
src/components/ui/Button.tsx
```

## Feature Generator

Creates a new feature with its main component in `src/features/{featureName}/`.

Prompts:
- **name**: The name of the feature
- **component**: The name of the main component

Example output for a 'userProfile' feature with 'ProfileCard' component:
```
src/features/userProfile/ProfileCard.tsx
src/features/userProfile/index.ts
```

## Page Generator

Creates a new Next.js page in `src/app/{path}/`.

Prompts:
- **path**: The page path (e.g. "restaurants/new")
- **withLayout**: Whether to create a layout file

Example output for path 'restaurants/new' with layout:
```
src/app/restaurants/new/page.tsx
src/app/restaurants/new/layout.tsx
```