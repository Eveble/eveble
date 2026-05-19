import { defineConfig } from 'vitest/config';
import ts from 'typescript';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';
import os from 'os';

let tsProgram: ts.Program | null = null;
let tsSourceFiles: Map<string, ts.SourceFile> | null = null;

let transformCache: {
  get: (filePath: string, contentHash: string) => string | null;
  set: (filePath: string, contentHash: string, code: string) => void;
  computeHash: (content: string) => string;
} | null = null;

function getCache() {
  if (transformCache) return transformCache;
  try {
    const { TransformCache } = require('tsruntime/dist/cache');
    transformCache = new TransformCache({
      cacheDir: path.join(__dirname, '.tsruntime-cache'),
    });
  } catch {
    const CACHE_DIR = path.join(__dirname, '.tsruntime-cache');
    const MANIFEST_PATH = path.join(CACHE_DIR, 'manifest.json');
    const ENTRIES_DIR = path.join(CACHE_DIR, 'entries');
    const manifest = new Map<string, { contentHash: string }>();
    let loaded = false;

    function ensureDirs() {
      if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });
      if (!fs.existsSync(ENTRIES_DIR)) fs.mkdirSync(ENTRIES_DIR, { recursive: true });
    }

    function loadManifest() {
      if (loaded) return;
      loaded = true;
      ensureDirs();
      if (fs.existsSync(MANIFEST_PATH)) {
        try {
          const data = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
          for (const [fp, entry] of Object.entries(data)) {
            manifest.set(fp, entry as { contentHash: string });
          }
        } catch { manifest.clear(); }
      }
    }

    function saveManifest() {
      ensureDirs();
      const onDisk: Record<string, { contentHash: string }> = {};
      try {
        const raw = fs.readFileSync(MANIFEST_PATH, 'utf-8');
        Object.assign(onDisk, JSON.parse(raw));
      } catch { }
      const data: Record<string, { contentHash: string }> = {};
      manifest.forEach((entry, fp) => { data[fp] = entry; });
      const merged = { ...onDisk, ...data };
      const tmp = MANIFEST_PATH + '.tmp.' + process.pid;
      fs.writeFileSync(tmp, JSON.stringify(merged), 'utf-8');
      fs.renameSync(tmp, MANIFEST_PATH);
    }

    transformCache = {
      computeHash(content: string) {
        return crypto.createHash('sha256').update(content, 'utf-8').digest('hex').slice(0, 16);
      },
      get(filePath: string, contentHash: string) {
        loadManifest();
        const entry = manifest.get(filePath);
        if (!entry || entry.contentHash !== contentHash) return null;
        const entryPath = path.join(ENTRIES_DIR, `${contentHash}.json`);
        try { return JSON.parse(fs.readFileSync(entryPath, 'utf-8')).code as string; }
        catch { return null; }
      },
      set(filePath: string, contentHash: string, code: string) {
        loadManifest();
        manifest.set(filePath, { contentHash });
        const entryPath = path.join(ENTRIES_DIR, `${contentHash}.json`);
        if (!fs.existsSync(entryPath)) {
          ensureDirs();
          const tmp = entryPath + '.tmp.' + process.pid;
          fs.writeFileSync(tmp, JSON.stringify({ code, contentHash }), 'utf-8');
          fs.renameSync(tmp, entryPath);
        }
        saveManifest();
      },
    };
  }
  return transformCache;
}

function needsTransformer(id: string): boolean {
  return id.endsWith('.ts') && !id.includes('node_modules') && !id.endsWith('.d.ts');
}

function getTsProgram(): ts.Program {
  if (tsProgram) return tsProgram;
  const configPath = ts.findConfigFile(
    __dirname,
    ts.sys.fileExists,
    'tsconfig.json'
  );
  if (!configPath) throw new Error('tsconfig.json not found');
  const configFile = ts.readConfigFile(configPath!, ts.sys.readFile);
  const parsedConfig = ts.parseJsonConfigFileContent(
    configFile.config, ts.sys, path.dirname(configPath),
    {
      noEmit: false, declaration: false,
      module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2018,
      sourceMap: false,
    }, configPath
  );
  const testDir = path.join(__dirname, 'test');
  const testFiles = ts.sys.readDirectory(testDir, ['.ts'], ['.d.ts'], ['**/*.ts']);
  for (const tf of testFiles) {
    if (!parsedConfig.fileNames.includes(tf)) {
      parsedConfig.fileNames.push(tf);
    }
  }
  tsProgram = ts.createProgram(parsedConfig.fileNames, parsedConfig.options);
  tsSourceFiles = new Map();
  for (const sf of tsProgram.getSourceFiles()) {
    if (!sf.isDeclarationFile) tsSourceFiles.set(sf.fileName, sf);
  }
  return tsProgram;
}

const transformerPath = require.resolve(
  'tsruntime/dist/transform/transformer.js'
);
const transformerFactory = require(transformerPath).default;

export default defineConfig({
  vite: {
    esbuild: {
      tsconfigRaw: {
        compilerOptions: {
          experimentalDecorators: true,
          emitDecoratorMetadata: true,
          target: 'esnext',
          module: 'esnext',
        },
      },
    },
  },
  plugins: [
    {
      name: 'tsruntime',
      enforce: 'pre',
      transform(code: string, id: string) {
        if (!needsTransformer(id)) return null;
        if (!code.includes('@Type(') && !code.includes("@Type(") && !code.includes('instanceOf<')) return null;

        const cache = getCache();
        const contentHash = cache.computeHash(code);
        const cached = cache.get(id, contentHash);
        if (cached !== null) return { code: cached, map: null };

        const prog = getTsProgram();
        let sourceFile = tsSourceFiles!.get(id);
        if (!sourceFile) {
          const normalized = path.resolve(id);
          for (const [key, sf] of tsSourceFiles!.entries()) {
            if (path.resolve(key) === normalized) {
              sourceFile = sf;
              break;
            }
          }
        }
        if (!sourceFile) return null;
        let outputCode = '';
        prog.emit(sourceFile, (fileName: string, text: string) => {
          if (fileName.endsWith('.js')) outputCode = text;
        }, undefined, false, {
          before: [transformerFactory(prog)],
        });
        if (!outputCode) return null;

        cache.set(id, contentHash, outputCode);
        return { code: outputCode, map: null };
      },
    },
  ],
  test: {
    environment: 'node',
    include: ['test/**/*.test.ts'],
    exclude: ['node_modules', 'dist'],
    setupFiles: ['test/common.ts'],
    testTimeout: 10000,
    globals: false,
  },
});
