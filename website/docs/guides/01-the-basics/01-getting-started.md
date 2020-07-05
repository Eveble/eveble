---
title: Getting Started
sidebar_label: Getting Started
---

## Requirements

- [Node.js][nodejs] MUST be v14.0 or later.

## Installation

1. To use @eveble/eveble with your app:

```bash
npm install @eveble/eveble
```

or

```bash
yarn add @eveble/eveble
```

You'll also need to [setup development environment][eveble-setup-development-environment] or use directly our [boilerplate to create new project](#create-a-eveble-app).

## Complementary Packages

Most likely, you'll also need [the Eveble testing framework][eveble-testing]:

```bash
npm install @eveble/eveble
npm install --save-dev @eveble/testing
```

## Create a Eveble App

The recommended way to start new apps with Eveble is by using the [official Eveble boilerplate][eveble-boilerplate]:

```bash
# Clone the repository
$ git clone https://github.com/eveble/eveble-boilerplate.git <YOUR_PROJECT_NAME>
# Go into the repository
$ cd <YOUR_PROJECT_NAME>
# Run setup
$ npm run setup
```

[nodejs]: https://nodejs.org/
[eveble-setup-development-environment]: https://eveble.github.io/eveble/docs/guides/02-environment-setup/01-setting-up-the-development-environment.md
[eveble-boilerplate]: https://github.com/eveble/eveble-boilerplate
[eveble-testing]: https://github.com/eveble/testing
