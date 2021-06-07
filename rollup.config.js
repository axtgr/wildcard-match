/* eslint-disable */

import del from 'rollup-plugin-delete'
import { terser } from 'rollup-plugin-terser'
import typescript from '@wessberg/rollup-plugin-ts'
import cleanup from 'rollup-plugin-cleanup'
import transformDefaultExport from 'ts-transform-default-export'

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
      name: 'wcmatch',
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
  plugins: [
    del({ targets: `${OUT_DIR}/*` }),
    typescript(
      (() => {
        // We don't want to transform the default export for the ES bundle. However,
        // there is apparently no way to tell what the current output format is
        // in the context of the transformer factory, so we do it in a hacky way.
        let currentFormat
        return {
          hook: {
            outputPath(path, kind) {
              if (kind === 'declaration') {
                if (path.endsWith('.es.d.ts')) {
                  currentFormat = 'es'
                } else if (path.endsWith('.umd.d.ts')) {
                  currentFormat = 'umd'
                } else {
                  currentFormat = 'cjs'
                }
              }
            },
          },
          transformers: ({ program }) => {
            return {
              afterDeclarations:
                currentFormat === 'es' ? undefined : transformDefaultExport(program),
            }
          },
        }
      })()
    ),
    // Remove all comments except JSDoc
    cleanup({
      comments: /^\*/,
      extensions: ['ts'],
    }),
  ],
}
