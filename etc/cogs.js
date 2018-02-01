var MINIFY = !!process.env.MINIFY;

module.exports = {
  transformers: [].concat(
    {name: 'json', only: '**/*.json'},
    {
      name: 'replace',
      only: '**/*.js',
      options: {
        flags: 'g',
        patterns: {
          'process.env.NODE_ENV': MINIFY ? "'production'" : "'development'"
        }
      }
    },
    {
      name: 'babel',
      only: 'client/**/*.+(js|json)',
      options: {
        plugins: ['transform-runtime'],
        presets: ['env', 'stage-0', 'react']
      }
    },
    {
      name: 'concat-commonjs',
      only: '**/*.+(js|json)',
      options: {
        alias: {
          react:
            `react/cjs/react.${MINIFY ? 'production.min' : 'development'}.js`
        },
        entry: 'client/index.js',
        extensions: ['.js', '.json']
      }
    },
    MINIFY ? {
      name: 'uglify-js',
      only: '**/*.+(js|json)',
      except: '**/*+(-|_|.)min.js'
    } : [],
    {name: 'sass', only: 'styles/**/*.scss'},
    {name: 'autoprefixer', only: 'styles/**/*.scss'},
    MINIFY ? {name: 'clean-css', only: 'styles/**/*.scss'} : []
  ),
  builds: {
    'client/public/**/*': {base: 'client/public', dir: 'public'},
    'client/index.js': {base: 'client', dir: 'public'},
    'styles/index.scss': {base: 'styles', dir: 'public', ext: {'.scss': '.css'}}
  }
};
