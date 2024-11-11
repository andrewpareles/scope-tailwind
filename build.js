const esbuild = require('esbuild');

esbuild.build({
    entryPoints: ['./src/main.ts'],
    bundle: true,
    platform: 'node',
    target: 'node14',
    outfile: './dist/main.js',
    format: 'cjs',
    treeShaking: true,
    //   banner: {
    //     js: '#!/usr/bin/env node',
    //   },
    // ignoreAnnotations: true,  // Prevents following internal requires

}).catch((e) => {
    console.log(e)
    process.exit(1)
});