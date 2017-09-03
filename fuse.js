const path = require('path');
const fsbx = require('fuse-box');
const autoprefixer = require('autoprefixer');
const Sparky = fsbx.Sparky;

let fuse;
let app;
let vendor;
let isDevelopment = false;

Sparky.task('default', ['_build'], () => {
    return fuse.run();
});

Sparky.task('_build', ['_bundle'], () => {
    return Sparky.src('assets', { base: 'src' })
        .dest('dist');
});

Sparky.task('_bundle', ['_clean'], () => {
    fuse = fsbx.FuseBox.init({
        homeDir: 'src',
        output: 'dist/$name.js',
        alias: {
            // with compiler
            vue: 'vue/dist/vue.common',
        },
        hash: !isDevelopment,
        sourceMaps: isDevelopment,
        plugins: [
            fsbx.VuePlugin(),
            fsbx.HTMLPlugin(),
            fsbx.WebIndexPlugin({
                template: 'src/index.html',
            }),
            !isDevelopment && fsbx.UglifyESPlugin(),
            [
                fsbx.SassPlugin(),
                fsbx.PostCSSPlugin({
                    plugins : [
                        autoprefixer({
                            browsers: [
                                'iOS >= 6',
                                'Android >= 4',
                            ]
                        })
                    ],
                    sourceMaps: isDevelopment,
                }),
                fsbx.CSSPlugin({
                    group: 'app.css',
                    outFile: 'dist/app.css',
                    inject: false,
                    minify: !isDevelopment,
                }),
            ],
        ]
    });

    vendor = fuse.bundle('vendor')
        .instructions('~ index.ts');

    app = fuse.bundle('app')
        .instructions('!> [index.ts]');
});

Sparky.task('_clean', () => {
    return Sparky.src('dist')
        .clean('dist');
});

Sparky.task('dev', ['_env', '_bundle'], () => {
    vendor.hmr().watch();
    app.hmr().watch();
    fuse.dev();
    fuse.run();
    return Sparky.watch('assets', { base: 'src' })
        .dest('dist');
});

Sparky.task('_env', () => {
    return new Promise((resolve) => {
        isDevelopment = true;
        resolve();
    });
});
