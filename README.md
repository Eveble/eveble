<img src="https://dummyimage.com/1116x324/000/fff&text=Banner" alt="banner" align="center" />

<br />
<br />

<div align="center"><strong>Event Sourcing framework for Node.js</strong></div>
<br />
<div align="center">
<strong>Eveble</strong> is an event sourcing framework with modular architecture for <strong>DDD</strong>(<strong>D</strong>omain <strong>D</strong>riven <strong>D</strong>esign) applications in Node.js
</div>

<br />

---

## Requirements

- [Node.js][nodejs] MUST be v14.0 or later

## Installation

To use install Eveble:

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

## Documentation

The **@eveble/eveble** docs are now published at **[https://eveble.github.io/eveble/][package-homepage]** .

## License

[MIT](LICENSE)

[package-homepage]: https://eveble.github.io/eveble/
[nodejs]: https://nodejs.org/
[eveble-setup-development-environment]: https://eveble.github.io/eveble/docs/guides/02-environment-setup/01-setting-up-the-development-environment.md
[eveble-boilerplate]: https://github.com/eveble/eveble-boilerplate
[eveble-testing]: https://github.com/eveble/testing
