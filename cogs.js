import child_process from 'node:child_process';
import { promisify } from 'node:util';
import zlib from 'node:zlib';

import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import tailwindcss from 'tailwindcss';

const { Buffer, process } = globalThis;

const { env } = process;

const exec = promisify(child_process.exec);
const brotliCompress = promisify(zlib.brotliCompress);

const watch = env.WATCH === '1';
const minify = env.MINIFY === '1';
const target = 'es2020';
const minifyJs = {
  name: 'esbuild',
  options: { legalComments: 'none', minify: true, target }
};

if (watch) await exec("find dist -name '*.br' -exec rm {} \\;");

export default {
  main: {
    transformers: [].concat(
      {
        name: 'svgo',
        only: '**/*.svg',
        options: {
          plugins: [
            'removeDimensions',
            {
              name: 'preset-default',
              params: { overrides: { removeViewBox: false } }
            }
          ]
        }
      },
      {
        only: '**/*.svg',
        fn: ({ file: { buffer } }) => {
          const svg = buffer.toString();
          return {
            buffer: Buffer.from(
              [
                `import { memo } from 'endr';`,
                `export default memo(props => ${svg.replace(/(<svg .*?)>/, '$1 {...props}>')});`
              ].join('\n')
            )
          };
        }
      },
      {
        name: 'esbuild',
        only: '**/*.+(js|svg)',
        options: {
          format: 'cjs',
          jsx: 'automatic',
          jsxImportSource: 'endr',
          loader: 'jsx',
          target
        }
      },
      {
        name: 'concat-commonjs',
        only: '**/*.+(js|svg)',
        options: { entry: 'app/index.js', resolverGlobal: '_fdc' }
      },
      minify ? { ...minifyJs, only: '**/*.+(js|svg)' } : [],
      {
        name: 'postcss',
        only: 'app/index.css',
        options: {
          plugins: [
            tailwindcss({ content: ['app/**/*.+(html|js|svg)'] }),
            autoprefixer,
            ...(minify ? [cssnano] : [])
          ]
        }
      },
      {
        only: 'app/index.css',
        fn: ({ file: { links } }) => ({
          links: [...links, 'app/**/*.+(html|js|svg)']
        })
      }
    ),
    builds: { 'app/index.+(css|js)': { base: 'app', dir: 'dist' } }
  },
  index: {
    requires: 'main',
    transformers: 'underscore-template',
    builds: { 'app/public/index.html': { base: 'app/public', dir: 'dist' } }
  },
  brotli: {
    requires: 'index',
    transformers: async ({ file: { buffer } }) => ({
      buffer: await brotliCompress(buffer)
    }),
    builds: { 'dist/index.html': { ext: { '.html': '.html.br' } } }
  }
};
