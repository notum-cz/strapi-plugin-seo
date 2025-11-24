> ⚠️ **Disclaimer**: This repository has been archived and moved in the Strapi Community organization: https://github.com/strapi-community/strapi-plugin-seo

# Strapi plugin SEO

The official plugin to make your Strapi content SEO friendly

## Features

- Easily see which Content-Types does have the SEO component or not.
- Manage the important tags for your SEO (metatitle, metadescription) and preview your content in the SERP
- Manage your meta social tags (Facebook & Twitter) and preview your post.
- Strong SEO analysis for your content.

## Installation

To install this plugin, you need to add an NPM dependency to your Strapi application.

```sh
# Using Yarn
yarn add @strapi/plugin-seo

# Or using PNPM
pnpm add @strapi/plugin-seo

# Or using NPM
npm install @strapi/plugin-seo
```

## How it works

When clicking on the plugin homepage for the first time, the plugin will automatically look if a `shared.seo` component exists in your project. If not, the plugin will automatically create it with a sub `shared.meta-social` component.

If a `shared.seo` component already exists in your project. You might want to rename it or delete it otherwise, the plugin will not create the necessary component in order to work.

#### Homepage

From there you can get an overview of which content-types contains the SEO component or not. You can quickly add the SEO component to a selected content-type.

**Note**: By doing this, you will be redirected to the Content-Types builder on the specific content-type. You'll need to create a new component at the **root** of this content-type called `seo` using the existing component the plugin created for you: `shared.seo`.

#### Content Manager

From any content manager view for a content-type that contains the SEO component, you'll be able to see a right-side card dedicated for the SEO plugin. From there you can see a quick SEO analysis and action for you to perform (opening preview, opening complete analysis details modal).

**Note**: You'll need to fill your SEO component with data to be able to see the SERP preview, Social post preview and complete analysis.


## Configuration

`./config/plugins.ts`

```ts
export default () => ({
  // ...
  seo: {
    enabled: true,
  },
  // ...
});
```

Then, you'll need to build your admin panel:

```sh
# Using Yarn
yarn build

# Or using PNPM
pnpm build

# Or using NPM
npm run build
```

## SEO settings page

You'll be able from the SEO settings page to import a `shared.seo` & `shared.meta-social` components from any GitHub repository By default, our [components GitHub repository](https://github.com/strapi/components) is being used.

**Notice**: If you decide to import your own components, make sure that they belong to a `shared` category that their names is the same (`seo`, `meta-social`).
**Notice2**: When adding your SEO component, make sure to name it 'seo' and to include it in the root of your Content-Type.

## EditView SEO button

Once you create your SEO component in the edit view inside the Content Manager, the SEO button will appear on the the [right-links injection zone](https://docs.strapi.io/developer-docs/latest/developer-resources/plugin-api-reference/admin-panel.html#injection-zones-api). You'll be able to:

- Manage the meta title & description of your content and preview it in SERP.
- Manage your meta social tags (Facebook & Twitter) and preview your post.
- Analyze your content a little deeper via an SEO analysis of your content.
