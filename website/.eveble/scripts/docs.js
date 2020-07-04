const fs = require('fs');
const path = require('path');

module.exports = class ConfigGenerator {
  /**
   * Create an ConfigGenerator.
   * @param {Object} npmConfig - `package.json` as parsed JSON object.
   * @param {{classes: string, interfaces: string, guides: string}=} paths - Object with paths that point to parts of documentation.
   */
  constructor(npmConfig, paths) {
    this.npmConfig = npmConfig;
    this.config = this.normalize(this.npmConfig);
    this.paths = paths;
  }

  /**
   * Normalizes project to parsable config by Docusaurus.
   * @param {Object} npmConfig - `package.json` as parsed JSON object.
   */
  normalize(npmConfig) {
    const project = {};
    // Package name WITHOUT scope '@_username_/'
    const unscopedName = this.getUnscopedPackageName(npmConfig.name);
    // Package name WITH scope '@_username_/'
    project.projectName = npmConfig.name;
    project.isScoped = this.isScopedPackageName(npmConfig.name);
    project.scope = this.getScope(npmConfig.name);
    project.title = unscopedName;
    project.tagline = npmConfig.description;
    /*
    https://v2.docusaurus.io/docs/deployment
    URL for your GitHub Page's user/organization page.
    This is commonly https://_username_.github.io.
    */
    project.baseUrl = `/${unscopedName}/`;
    // Ensure that homepage is using trailing '/' i.e. https://_username_.github.io/_package-name_/
    let homepage = npmConfig.homepage;
    if (!this.hasTrailingSlashOnUrl(homepage)) {
      homepage = `${npmConfig}/`;
    }
    // URL to documentation
    project.url = homepage.replace(`/${unscopedName}/`, '');
    project.repositoryUrl = npmConfig.repository.url
      .replace('.git', '')
      .replace('git', 'https');
    project.license = npmConfig.license;
    project.organizationName = this.getAuthorName(npmConfig.author);
    project.organizationUrl = this.getAuthorUrl(npmConfig.author);
    return project;
  }

  /**
   * Returns package scope(@_username_).
   * @param {string} name - Name property from `package.json`
   * @returns {string} Package scope as string, else undefined.
   */
  getScope(name) {
    const potentiallyScopedPackageName = name.split('/');

    return this.isScopedPackageName(name) === true
      ? potentiallyScopedPackageName[0]
      : undefined;
  }

  /**
   * Returns package name without scope(without @_username_).
   * @param {string} name - Name property from `package.json`
   * @returns {string} Package name as string.
   */
  getUnscopedPackageName(name) {
    if (this.isScopedPackageName(name)) {
      // Split by '/' since package is scoped(i.e. `@_username_/package-name`).
      const parts = name.split('/');
      return parts[1];
    }
    return name;
  }

  /**
   * Evaluates if provided name is scoped.
   * @param {string} name - Name property from `package.json`
   * @returns {string} Returns `true` if package is scoped, else `false`.
   */
  isScopedPackageName(name) {
    const potentiallyScopedPackageName = name.split('/');
    return potentiallyScopedPackageName.length === 2;
  }

  /**
   * Returns author name.
   * @param {string|{name: string, email?: string, url?: string}} author - Author string or object containing it.
   * @returns Author name as a string.
   */
  getAuthorName(author) {
    if (typeof author === 'string') {
      // TODO: Add support for notation like: "Author <email@domain.com> (https://website.com)"
      return author;
    } else {
      return author.name;
    }
  }

  /**
   * Evaluates if URL has trailing slash(ends with `/`).
   * @param {string} url - Valid URL.
   * @returns Returns `true` if url has trailing slash, else `false`.
   */
  hasTrailingSlashOnUrl(url) {
    return /\/$/.test(url);
  }

  /**
   * Returns author url.
   * @param {string|{name: string, email?: string, url?: string}} author - Author string or object containing it.
   * @returns Author's url as a string, else undefined.
   */
  getAuthorUrl(author) {
    if (typeof author === 'string') {
      // TODO: Add support for notation like: "Author <email@domain.com> (https://website.com)"
      return undefined;
    } else {
      return author.url;
    }
  }

  /**
   * Returns normalized config for Docusaurus.
   */
  getConfig() {
    return this.config;
  }

  /**
   * Lists all files recursively in directory.
   * @param {string} dir - Path of directory.
   * @param {Object} list - List of files with subdirectories.
   * @param {string} subDir - Subdirectory name.
   * @return {Object} List of all files.
   */
  listFilesInDirRecursive(dir, list = {}, subDir = undefined) {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
      if (/^\./.test(file) !== true) {
        const filePath = path.join(dir, file);
        const fileStat = fs.lstatSync(filePath);
        if (fileStat.isDirectory()) {
          const dir = file;
          if (list[dir] === undefined) {
            list[dir] = [];
          }
          this.listFilesInDirRecursive(filePath, list, dir);
        } else {
          if (subDir !== undefined) {
            list[subDir].push(this.normalizePathForDocusaurusConfig(filePath));
          } else {
            list.push(this.normalizePathForDocusaurusConfig(filePath));
          }
        }
      }
    });

    return list;
  }

  /**
   * Changes case of string to 'Title Case'.
   * @param {string} str - String to change.
   * @return {string} Changed string case.
   */
  titleCase(str) {
    return str
      .toLowerCase()
      .split(' ')
      .map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(' ');
  }

  /**
   * Normalizes categories as directory names.
   * @param {Object} list - List of files with subdirectories.
   * @param {Object} Normalized list.
   */
  normalizeCategories(list) {
    const normalized = {};
    for (const [category, filesPaths] of Object.entries(list)) {
      normalized[
        this.titleCase(category.replace(/-/g, ' ').replace(/\d+/, '').trim())
      ] = filesPaths;
    }

    return normalized;
  }

  /**
   * Normalizes path for sidebar.
   * @param {string} path - Path to markdown file.
   * @return {string} Normalized path.
   */
  normalizePathForSidebar(path) {
    return path.replace('./docs/', '').replace('.md', '');
  }

  /**
   * Normalizes path for Docusaurus.
   * @param {string} path - Path to markdown file.
   * @returns {string} Normalized path compatible with Docusaurus
   */
  normalizePathForDocusaurusConfig(path) {
    return path.replace('.md', '').replace('docs/', '');
  }

  /**
   * Generates path to first element of API.
   * @returns {string} Path to first element of api.
   */
  generatePathToApi() {
    const files = this.getFilesInClasses();
    if (files.length === 0) {
      return '#';
    }
    return `${this.paths.classes.replace(/^\.\//, '')}/${files[0].replace(
      '.md',
      ''
    )}`;
  }

  /**
   * Returns normalized paths to classes files for Docusaurus sidebar.
   * @returns {string[]} Array of paths as strings.
   */
  getClassesForSidebar() {
    return this.getPathsForSidebar(this.paths.classes);
  }

  /**
   * Returns list of all files in classes directory.
   * @returns {string[]} List of files in classes directory.
   */
  getFilesInClasses() {
    return this.listFilesInDir(this.paths.classes);
  }

  /**
   * Returns normalized paths to interfaces files for Docusaurus sidebar.
   * @returns {string[]} Array of paths as strings.
   */
  getInterfacesForSidebar() {
    return this.getPathsForSidebar(this.paths.interfaces);
  }

  /**
   * Returns normalized paths under guides directory recursively for Docusaurus sidebar.
   * @returns {string[]} Array of paths as strings.
   */
  getGuidesForSidebar() {
    return this.normalizeCategories(
      this.listFilesInDirRecursive(this.paths.guides, {})
    );
  }

  /**
   * Returns all files in directory(non-recursive).
   * @param {string} dir - Path to directory.
   * @return {string[]} List of files.
   */
  listFilesInDir(dir) {
    try {
      return fs.readdirSync(dir);
    } catch (e) {
      return [];
    }
  }

  /**
   * List full path to all files in directory.
   * @param {string} dir - Path to directory.
   * @return {string[]} List of files.
   */
  getPathsForSidebar(dir) {
    const paths = this.listFilesInDir(dir);
    return paths.map((path) => {
      return this.normalizePathForSidebar(`${dir}/${path}`);
    });
  }
};
