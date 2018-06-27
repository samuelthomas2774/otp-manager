One Time Password Manager
===

A simple Electron application for managing time-based one time passwords.

To do
---

- [x] Basic application structure and build scripts
- [x] Accounts store
- [x] Main window base
- [x] Account details window base
- [ ] UIs to create accounts
- [ ] UIs to update accounts
- [ ] UIs to delete accounts

Building
---

To build the full application:

```
npm run build

# or
npx gulp build
```

You can also build each section of the application separately:

```
npx gulp build-app
npx gulp build-main-window
npx gulp build-details-window
```

To watch files and recompile them when they change, subsitute build with watch:

```
npm run watch

# or
npx gulp watch

# or
npx gulp watch-app
npx gulp watch-main-window
npx gulp watch-details-window
```

To package the application:

```
npm run build
npm run package

# or
npm run release
```
