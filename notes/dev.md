# Design & development notes

[back to README](../README.md)

- [Design \& development notes](#design--development-notes)
  - [Making this a React component library](#making-this-a-react-component-library)
    - [Init with Vite](#init-with-vite)
    - [Going 'library mode'](#going-library-mode)
  - [Developping the library](#developping-the-library)


## Making this a React component library

### Init with Vite

From this project's parent directory:

```sh
npm create vite@latest
# Name: goaldr
# Chose: Ignore files and continue
# Framework: React
# Variant: Typescript

# then:
cd goaldr
```

[top](#design--development-notes)

### Going 'library mode'

Check all the changes made to the [vite.config.ts](../vite.config.ts) file.

In [tsconfig.json](../tsconfig.json), change `"include": ["src"]` with `"include": ["lib"]`.

Let's remove the files we don't need for our library: `rm -fr public src`.

In [package.json](../package.json), here are the notable additions:

- telling which files/folder to publish, and the entry points for code & types:

```json
{
  "...": "...",

  "files": [
    "dist"
  ],
  "main": "dist/main.js",
  "types": "dist/main.d.ts",

  "...": "...",
}
```

- to prevent the CSS files from being accidentally removed by the consumer's tree-shaking efforts

```json
{
  "...": "...",

  "sideEffects": [
    "**/*.css"
  ],
  
  "...": "...",
}
```

- React & related libs as peer/dev dependencies.

[top](#design--development-notes)

---

## Developping the library

In [package.json](../package.json), the `dev` task should consist in continuously building the lib: `"dev": "tsc && vite build --watch"`.

We now need to make sure we build before publishing: `"prepublishOnly": "npm run build"`.

Since we're talking about publishing: 

- make sure `"private": true` is removed.
- do an `npm init`, but make sure to remove the `dependencies` added by this process.

Regarding style, check that in [the .eslintrc.cjs](../.eslintrc.cjs) the plugins and the `""simple-import-sort/imports""` config tag added to automatically format the imports in a "standard" way.

[top](#design--development-notes)
