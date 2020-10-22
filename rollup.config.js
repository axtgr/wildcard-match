/* eslint-disable */

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
      entryFileNames: '[name].es.mjs',
      plugins: [],
    },
  ],
  external: ['path'],
  plugins: [
    del({ targets: `${OUT_DIR}/*` }),
    typescript({
      transformers: (() => {
        // We don't want to transform the default export for the ES bundle. However,
        // there is apparently no way to tell what the current bundle is in the context
        // of this function, so we simply count the bundles and disable the transformation
        // for the third one.
        let counter = 0
        return ({ program }) => {
          return {
            before: transformMacros(program),
            afterDeclarations:
              ++counter === 3
                ? undefined
                : transformDefaultExport(program, {
                    allowNamedExports: true,
                    keepOriginalExport: false,
                  }),
          }
        }
      })(),
    }),
    // Remove all comments except JSDoc
    cleanup({
      comments: /^\*/,
      extensions: ['ts'],
    }),
  ],
}
