import { defineConfig } from '@rslib/core';

import { version } from './package.json';

export default defineConfig({
    lib: [
        {
            format: 'esm',
            syntax: 'es2022',
            dts: true
        },
        {
            format: 'cjs',
            syntax: 'es2022'
        }
    ],
    source: {
        define: {
            VERSION: JSON.stringify(version)
        }
    },
    output: {
        minify: true
    }
});
