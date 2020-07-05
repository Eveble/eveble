const fs = require('fs');
const npmConfig = JSON.parse(fs.readFileSync('../package.json', 'utf8'));
const ConfigGenerator = require('./.eveble/scripts/docs');

const paths = {
  classes: './docs/api/classes',
  interfaces: './docs/api/interfaces',
  guides: './docs/guides',
};
const configGenerator = new ConfigGenerator(npmConfig, paths);
const project = configGenerator.getConfig();

module.exports = {
  title: project.title,
  tagline: project.tagline,
  url: project.url, // URL to documentation
  baseUrl: project.baseUrl,
  favicon: 'img/favicon.ico',
  organizationName: project.organizationName, // Usually your GitHub org/user name, use object to define author on package.json
  projectName: project.projectName, // Usually your repo name.
  themeConfig: {
    project: {
      license: project.license,
    },
    navbar: {
      title: project.title,
      logo: {
        alt: `${project.title} Logo`,
        src: 'img/logo.svg',
      },
      links: [
        {
          to: 'docs/guides/01-the-basics/01-getting-started',
          label: 'Docs',
          position: 'right',
        },
        {
          to: configGenerator.generatePathToApi(),
          label: 'API',
          position: 'right',
        },
        { to: 'blog', label: 'Blog', position: 'right' },
        {
          href: project.repositoryUrl,
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'light',
      logo: {
        alt: `${project.organizationName} Logo`,
        src: 'img/logo-monochrome.svg',
        href: project.organizationUrl,
      },
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Getting Started',
              to: 'docs/guides/01-the-basics/01-getting-started',
            },
            {
              label: 'API',
              to: configGenerator.generatePathToApi(),
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Issues',
              href: project.repositoryUrl + '/issues',
            },
            {
              label: 'Slack',
              href: 'https://eveble.slack.com',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: project.repositoryUrl,
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} <a href="${
        project.organizationUrl
      }" target="_blank">${
        project.organizationName
      }</a>. Built with <a href="https://docusaurus.io/" target="_blank">Docusaurus</a> <span class="love"></span>`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
