import buble from '@rollup/plugin-buble'
import { terser } from 'rollup-plugin-terser'
import resolve from '@rollup/plugin-node-resolve'

export default {
  input: 'lib/index.js',
  output: {
    file: 'dist/index.js',
    name: 'clamper.js',
    format: 'umd'
  },
  plugins: [
    resolve(),
    buble(),
    terser()
  ]
}
