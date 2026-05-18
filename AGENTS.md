# Migration Playbook: Mocha/Chai/Sinon → Vitest

## Phase 1: Install & Configure

### 1.1 Add vitest dependencies
```bash
npm install -D vitest@^4.1.6 vitest-mock-extended@3.1.0
npm uninstall mocha chai sinon ts-node nyc chai-as-promised sinon-chai ts-sinon @types/chai @types/mocha @types/sinon
```

### 1.2 Create vitest.config.ts

If your project uses `tsruntime` (or any custom TypeScript transformer) for type reflection, you need a custom transform plugin — the standard `tsconfig.json` is NOT enough because vitest bypasses it.

```typescript
import { defineConfig } from 'vitest/config';
import ts from 'typescript';
import path from 'path';

let tsProgram: ts.Program | null = null;
let tsSourceFiles: Map<string, ts.SourceFile> | null = null;

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
  tsProgram = ts.createProgram(parsedConfig.fileNames, parsedConfig.options);
  tsSourceFiles = new Map();
  for (const sf of tsProgram.getSourceFiles()) {
    if (!sf.isDeclarationFile) tsSourceFiles.set(sf.fileName, sf);
  }
  return tsProgram;
}

const transformerPath = require.resolve(
  'tsruntime/dist/transform/transformer.js' // ← YOUR TRANSFORMER PATH
);
const transformerFactory = require(transformerPath).default;

export default defineConfig({
  plugins: [
    {
      name: 'tsruntime',
      enforce: 'pre',
      transform(code: string, id: string) {
        if (!id.endsWith('.ts') || id.includes('node_modules') || id.endsWith('.d.ts')) return null;
        const prog = getTsProgram();
        const sourceFile = tsSourceFiles!.get(id);
        if (!sourceFile) return null;
        let outputCode = '';
        prog.emit(sourceFile, (fileName: string, text: string) => {
          if (fileName.endsWith('.js')) outputCode = text;
        }, undefined, false, {
          before: [transformerFactory(prog)],
        });
        if (!outputCode) return null;
        return { code: outputCode, map: { mappings: '' } };
      },
    },
  ],
  test: {
    environment: 'node',
    include: ['test/**/*.test.ts'],
    exclude: ['node_modules', 'dist'],
    testTimeout: 6000,
    globals: false, // DO NOT enable — use explicit imports
  },
});
```

Key points:
- `enforce: 'pre'` ensures the transformer runs before any other plugin
- The transformer creates a full TypeScript program and emits each file with the custom transformer applied
- `sourceMap: false` + `map: { mappings: '' }` avoids source map issues
- `globals: false` means every test file must explicitly import `describe`, `it`, `expect`, etc. from `vitest`

If your project does NOT use a custom transformer, a simple config suffices:
```typescript
import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: {
    environment: 'node',
    include: ['test/**/*.test.ts'],
    exclude: ['node_modules', 'dist'],
    globals: false,
  },
});
```

### 1.3 Update package.json scripts
```json
"test": "vitest run",
"test:unit": "vitest run test/unit",
"test:unit:watch": "vitest test/unit",
"test:integration": "vitest run test/integration",
"test:watch": "vitest",
"coverage": "vitest run --coverage"
```

---

## Phase 2: Global Replacements (codebase-wide)

Run these replacements across ALL test files (`.test.ts`):

### 2.1 Import replacements

| Old | New |
|---|---|
| `import { expect } from 'chai'` | `import { expect } from 'vitest'` |
| `import { stubInterface } from 'ts-sinon'` | `import { mock } from 'vitest-mock-extended'` |
| `import sinon from 'sinon'` | `import { vi } from 'vitest'` |
| `import chaiAsPromised from 'chai-as-promised'` | (remove) |
| `import sinonChai from 'sinon-chai'` | (remove) |
| `chai.use(sinonChai); chai.use(chaiAsPromised);` | (remove these lines) |

### 2.2 Sinon stub → vitest-mock-extended

**Simple stub creation:**
```typescript
// Before:
import { stubInterface } from 'ts-sinon';
const myStub = stubInterface<types.SomeInterface>();
// After:
import { mock } from 'vitest-mock-extended';
const myStub = mock<types.SomeInterface>();
```

**`withArgs().returns()` → `calledWith().mockReturnValue()`:**
```typescript
// Before:
validator.validate.withArgs('value', String).returns(true);
describer.describe.withArgs(val).returns(valStr);
// After:
validator.validate.calledWith('value', String).mockReturnValue(true);
describer.describe.calledWith(val).mockReturnValue(valStr);
```

**`withArgs().throws()` → `calledWith().mockImplementation(() => { throw ... })`:**
```typescript
// Before:
validator.validate.withArgs(2, Number).throws(error);
// After:
validator.validate.calledWith(2, Number).mockImplementation(() => { throw error; });
```

**`.returns()` (no args) → `.mockReturnValue()`:**
```typescript
// Before:
describer.describe.returns(valStr);
// After:
describer.describe.mockReturnValue(valStr);
```

### 2.3 Chai assertion replacements

| Chai | Vitest |
|---|---|
| `.to.be.true` | `.toBe(true)` |
| `.to.be.false` | `.toBe(false)` |
| `.to.be.undefined` | `.toBeUndefined()` |
| `.to.be.null` | `.toBeNull()` |
| `.to.equal(x)` | `.toBe(x)` |
| `.to.eql(x)` / `.to.deep.equal(x)` | `.toEqual(x)` |
| `.to.throw(ErrorType, msg)` | `.toThrow(ErrorType)` + `.toThrow(msg)` |
| `.to.throw(msg)` | `.toThrow(msg)` |
| `.to.be.instanceof(Class)` | `.toBeInstanceOf(Class)` |
| `.to.be.an('object')` | `typeof x === 'object'` |
| `.to.be.a('string')` | `.toBeTypeOf('string')` |
| `.to.have.length(n)` | `.toHaveLength(n)` |
| `.to.include(member)` | `.toContain(member)` |
| `.to.have.property(key, val)` | `expect(x[key]).toBe(val)` |
| `.to.be.above(n)` | `.toBeGreaterThan(n)` |
| `.to.be.below(n)` | `.toBeLessThan(n)` |
| `.to.match(regex)` | `.toMatch(regex)` |
| `.to.be.ok` | `.toBeTruthy()` |
| `.to.not.be.ok` | `.toBeFalsy()` |
| `.to.eventually.be.rejectedWith(X)` | `.rejects.toThrow(X)` |
| `.to.eventually.be.fulfilled` | `.resolves` |
| `.to.contain.all.keys([...])` | `Object.keys(x).sort().toEqual([...])` |
| `.to.be.calledOnce` | `.toHaveBeenCalledTimes(1)` |
| `.to.have.not.be.called` | `.not.toHaveBeenCalled()` |
| `.to.be.calledWithExactly(a, b)` | `.toHaveBeenCalledWith(a, b)` |
| `.to.be.calledWithMatch(obj)` | `.toHaveBeenCalledWith(expect.objectContaining(obj))` |

### 2.4 Mocha hooks → Vitest hooks

```typescript
// Before:
beforeEach(function () { ... });
afterEach(function () { ... });
before(function () { ... });
after(function () { ... });
context('...', () => { ... });

// After (import from vitest):
beforeEach(() => { ... });
afterEach(() => { ... });
beforeAll(() => { ... });
afterAll(() => { ... });
describe('...', () => { ... });  // context → describe
```

### 2.5 `done` callback → async/await
```typescript
// Before:
it('works', function (done) {
  someAsyncFunction(() => {
    expect(result).to.be.true;
    done();
  });
});
// After:
it('works', async () => {
  const result = await new Promise(resolve => {
    someAsyncFunction(resolve);
  });
  expect(result).toBe(true);
});
```

---

## Phase 3: Call Order Assertions (CRITICAL)

### Replacement rule

**NEVER use `/* TODO: verify call order */`** — vitest has built-in matchers.

| Sinon assertion | Vitest replacement |
|---|---|
| `expect(A).to.have.been.calledBefore(B)` | `expect(A).toHaveBeenCalledBefore(B as any)` |
| `expect(A).to.have.been.calledAfter(B)` | `expect(A).toHaveBeenCalledAfter(B as any)` |

Both `toHaveBeenCalledBefore` and `toHaveBeenCalledAfter` are built into vitest — no plugins needed.

Both arguments must be vitest mock functions (`vi.fn()`, `vi.spyOn()`, or from `mock<T>()`).

### Pattern for lifecycle hooks (before → on → after)

```typescript
// Before (sinon):
expect(MyModule.prototype.beforeStart).to.have.been.calledBefore(MyModule.prototype.onStart);
expect(MyModule.prototype.onStart).to.have.been.calledBefore(MyModule.prototype.afterStart);
expect(MyModule.prototype.afterStart).to.have.been.calledAfter(MyModule.prototype.onStart);

// After (vitest) — collapsed from 2 → 1 assertion per pair:
expect(MyModule.prototype.beforeStart).toHaveBeenCalledBefore(MyModule.prototype.onStart as any);
expect(MyModule.prototype.onStart).toHaveBeenCalledBefore(MyModule.prototype.afterStart as any);
expect(MyModule.prototype.afterStart).toHaveBeenCalledAfter(MyModule.prototype.onStart as any);
```

### Edge cases

**When the "after" spy was never called:**
```typescript
// FirstSpy was NOT called (confirmed by: expect(firstSpy).not.toHaveBeenCalled())
// Original: expect(secondSpy).to.have.been.calledBefore(firstSpy) — WRONG in sinon too
// Fix: Remove order assertion — both need to have been called for order to be meaningful
expect(secondSpy).toHaveBeenCalled();  // don't assert order
```

**When `vitest-mock-extended` Proxy-wrapped mocks break `toHaveBeenCalledBefore/After`:**
Unexpected behavior: `toHaveBeenCalledAfter` fails with "Compared values have no visual difference" when comparing mocks from `mock<T>()` (vitest-mock-extended). The Proxy wrapper interferes with vitest's internal spy comparison.
```typescript
// Workaround: use invocationCallOrder directly
expect(
  (consoleTransport.info as any).mock.invocationCallOrder[0]
).toBeGreaterThan(
  (log.debug as any).mock.invocationCallOrder[0]
);
```
Or simply verify both were called without asserting order.

---

## Phase 4: Mocking & Stubbing Migration (CRITICAL BEHAVIORAL RULES)

### 4.1 Core Mocking Replacement Rule

- NEVER use Sinon APIs:
  - `stub.withArgs`
  - `stub.returns`
  - `stub.throws`
  - `stub.callsFake`
  - `stub.calledWith(...).returns(...)` (Sinon style)
- NEVER attempt to simulate conditional behavior via chaining.
- Vitest mocks are **function-based**, not chain-based.

### 4.2 Required Mocking Tools

Use exactly one of:
- `vi.fn()` → for simple functions
- `vi.spyOn()` → for existing object methods
- `mock<T>()` from `vitest-mock-extended` → for interfaces/classes/services

```typescript
import { mock } from 'vitest-mock-extended';
import { vi } from 'vitest';
```

### 4.3 `vitest-mock-extended` usage rule (STRICT)

When mocking: interfaces, service classes, repositories, API clients, dependency injection objects — ALWAYS use:
```typescript
const serviceMock = mock<MyService>();
```
NEVER manually construct partial objects unless absolutely required.

### 4.4 Stub behavior replacement rules

**Default return:**
```typescript
mockFn.mockReturnValue(value);
```

**Async return:**
```typescript
mockFn.mockResolvedValue(value);
```

**Throwing errors:**
```typescript
mockFn.mockImplementation(() => {
  throw new Error('msg');
});
```

**Per-call sequencing:**
```typescript
mockFn
  .mockReturnValueOnce(a)
  .mockReturnValueOnce(b);
```

**Argument-based logic (ONLY valid conditional pattern):**
```typescript
mockFn.mockImplementation((arg) => {
  if (arg === expected) return value;
});
```
This is the ONLY allowed alternative to Sinon `.withArgs()`.

### 4.5 No `.calledWith()` behavior chaining rule

`.calledWith()` must NEVER be used to define behavior. It is ONLY allowed when provided by `vitest-mock-extended` for assertion-like behavior, NOT for logic branching.

If behavior depends on arguments → ALWAYS use `mockImplementation`.

### 4.6 Object argument matching rule (VERY IMPORTANT)

Because `calledWith` uses **reference equality**, all object arguments must follow this rule:

```typescript
// If object literal is passed:
mockFn
  .calledWith(expect.objectContaining({
    kind: 19,
    name: 'MyExample'
  }))
  .mockReturnValue(value);
```

Apply when: inline object literals, objects constructed inside tested code, new class instances.
NOT needed for: primitives (string, number, boolean), reused object references.

### 4.7 Dependency injection mocking rule

- ALWAYS mock at service boundary: repository layer, API clients, external services.
- DO NOT mock internal private functions unless explicitly required.

### 4.8 Spy rule

```typescript
vi.spyOn(obj, 'method').mockResolvedValue(value);
```
Use only when real implementation exists and partial override is needed. Otherwise use `mock<T>()`.

### 4.9 Assertion separation rule (NO MIXING)

Mock setup must NEVER contain expectations.

❌ Wrong:
```typescript
mockFn.calledWith(x).mockReturnValue(y);
```

✅ Correct:
```typescript
mockFn.mockReturnValue(y);
expect(mockFn).toHaveBeenCalledWith(x);
```

### 4.10 Migration safety rule

During migration:
- Remove ALL Sinon imports
- Replace all stubs with `vi.fn` or `mock<T>()`
- Ensure no `.withArgs()` or `.calledWith()` logic remains for behavior control
- Ensure tests remain deterministic without chaining mock state

### 4.11 Constructor Mocking Rule (CRITICAL)

When mocking classes that will be instantiated with `new`, you CANNOT use arrow functions or simple `vi.fn()` mocks.

**❌ WRONG:**
```typescript
const MockClass = vi.fn(() => instance);       // FAILS: arrow function
const MockClass = vi.fn().mockImplementation(() => instance);  // FAILS: arrow function
```
Arrow functions cannot be used with the `new` keyword.

**✅ CORRECT PATTERNS:**

**Pattern 1: Mock class with return override (simplest)**
```typescript
const mockInstance = mock<Pulse>();

class PulseMock {
  constructor(options?: any) {
    return mockInstance as any;
  }
}

const PulseConstructorSpy = vi.fn(PulseMock);
```
Use when: tracking constructor calls, returning same mock instance.

**Pattern 2: Regular function constructor**
```typescript
const mockInstance = mock<Pulse>();

const PulseMock = vi.fn(function(this: any, options?: any) {
  return mockInstance;
});
```
Use when: quick inline mock with minimal constructor logic.

**Pattern 3: Full mock class with real constructor logic**
```typescript
class PulseMock {
  options: any;
  constructor(options?: any) {
    this.options = options;
  }
  someMethod = vi.fn();
  anotherMethod = vi.fn();
}
const PulseConstructorSpy = vi.fn(PulseMock);
```
Use when: constructor needs to preserve real behavior or verify instance properties.

**Pattern 4: Conditional instance returns**
```typescript
const defaultInstance = mock<Pulse>();
const specialInstance = mock<Pulse>();

const PulseMock = vi.fn(function(this: any, options?: any) {
  if (options?.special) return specialInstance;
  return defaultInstance;
});
```
Use when: different constructor arguments should return different instances.

**Why Arrow Functions Fail:**
```typescript
const BadMock = () => instance;
new BadMock(); // TypeError: BadMock is not a constructor
```
JavaScript/TypeScript arrow functions cannot be constructors because they don't have their own `this` binding, don't have a `prototype` property, and cannot be called with `new`. Always use **regular functions** or **class syntax** for constructor mocks.

---

## Phase 5: VSCode Launch Configuration

Create `.vscode/launch.json` for debugging tests:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "vitest:all",
      "type": "node",
      "request": "launch",
      "program": "${workspaceRoot}/node_modules/vitest/vitest.mjs",
      "args": ["run", "--reporter", "verbose"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen",
      "smartStep": true,
      "skipFiles": ["<node_internals>/**", "${workspaceRoot}/node_modules/**"],
      "env": { "NODE_ENV": "test" }
    },
    {
      "name": "vitest:current",
      "type": "node",
      "request": "launch",
      "program": "${workspaceRoot}/node_modules/vitest/vitest.mjs",
      "args": ["--reporter", "verbose", "--watch", "${file}"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen",
      "smartStep": true,
      "skipFiles": ["<node_internals>/**", "${workspaceRoot}/node_modules/**"],
      "env": { "NODE_ENV": "test" }
    }
  ]
}
```

Key differences from Mocha launch config:
- `program` points to `vitest/vitest.mjs` instead of mocha
- The "vitest:current" config uses `--watch ${file}` for auto-rerun on file changes

---

## Phase 6: Remove Mocha Config Files

Delete files that were only used by Mocha/nyc:
- `.mocharc.json`
- `.nycrc.json`
- Old VSCode launch config (the new one replaces it)
