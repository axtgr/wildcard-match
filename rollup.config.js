/* eslint-disable */

import Path from 'path'
import del from 'rollup-plugin-delete'
import { terser } from 'rollup-plugin-terser'
import typescript from '@wessberg/rollup-plugin-ts'
import cleanup from 'rollup-plugin-cleanup'
import transformDefaultExport from 'ts-transform-default-export'
import transformMacros from 'typescript-transform-macros'

const INPUT_FILE = 'src/index.ts'
const OUT_DIR = 'build'

export default {
  input: INPUT_FILE,
  output: [
    {
      dir: OUT_DIR,
      format: 'cjs',
      sourcemap: true,
      exports: 'default',
      entryFileNames: '[name].js',
      plugins: [],
    },
    {
      dir: OUT_DIR,
      format: 'umd',
      sourcemap: true,
      name: 'wildcard-match',
      exports: 'default',
      entryFileNames: '[name].umd.js',
      plugins: [terser()],
    },
    {
      dir: OUT_DIR,
      format: 'es',
      sourcemap: true,
      entryFileNames: '[name].mjs',
      plugins: [],
    },
  ],
  external: ['path'],
  plugins: [
    del({ targets: `${OUT_DIR}/*` }),
    typescript({
      transformers: ({ program }) => ({
        before: transformMacros(program),
        afterDeclarations: transformDefaultExport(program, {
          allowNamedExports: true,
          keepOriginalExport: true,
        }),
      }),
      hook: {
        // Do not generate more than one declaration file
        outputPath: (path, kind) => {
          if (kind === 'declaration') {
            return Path.join(
              Path.dirname(path),
              Path.basename(INPUT_FILE, Path.extname(INPUT_FILE)) + '.d.ts'
            )
          }
          return path
        },
      },
    }),
    // Remove all comments except JSDoc
    cleanup({
      comments: /^\*/,
      extensions: ['ts'],
    }),
  ],
}
