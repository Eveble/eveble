import { defineConfig } from 'vitest/config';
import ts from 'typescript';
import path from 'path';

let tsProgram: ts.Program | null = null;
let tsSourceFiles: Map<string, ts.SourceFile> | null = null;

function needsTransformer(id: string): boolean {
  return id.endsWith('.ts') && !id.includes('node_modules') && !id.endsWith('.d.ts');
}

function getTsProgram(): ts.Program {
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
