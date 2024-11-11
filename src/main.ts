import { Command } from 'commander';

import { prefixify } from './prefixify-babel';

import path from 'path';
import { scopify } from './scopify-css';


// Main CLI function
async function main() {
    const program = new Command();

    program
        .name('scopify-tailwind')
        .description('CLI tool for scoping Tailwind CSS classes')
        .version('1.0.0')
        .argument('<src>', 'Source directory containing React/TSX files', './src')
        .option('-n, --src2 <src2>', 'Name of intermediary folder that will be created', './src2')
        .option('-c, --css <css>', 'Path to CSS file relative to src2 folder, e.g. styles.css', 'styles.css')
        .option('-p, --prefix <prefix>', 'The tailwind prefix to add e.g. "glasstw-"', 'glasstw-')
        .option('-s, --scope <scope>', 'The className you should use to indicate you want these styles to apply (default: "scope")', 'scope')
        .option('-g, --ignoreprefix <ignoreprefix>', 'If a class has this prefix, it won\'t be scoped. (default: "@@")', '@@')
        .action(async (src: string, options: any) => {
            try {
                console.log('OPTIONS', options)
                const {
                    src2,
                    css,
                    prefix: TW_PREFIX, //'glasstw-'; // adds this prefix to all the classNames inside a className= tag
                    scope, // const scopeName = 'scope' // the className used in the root that this will be scoped to
                    ignoreprefix: TW_PREFIX_IGNORE, // const ignorePrefix = '@@' // if you have className="@@scope", it will turn into className="scope", not className="glasstw-scope"
                } = options

                console.log(`Prefixifying classNames... \n${src}  -->  ${src2}`);
                prefixify(src, src2, TW_PREFIX, TW_PREFIX_IGNORE);
                console.log('✓ Successfully prefixified classNames');

                const pathToCss = path.join(src2, css)
                console.log(`Prefixifying css file... \n${pathToCss}  -->  ${pathToCss} (replace)`);
                scopify(pathToCss, scope, TW_PREFIX)
                console.log('✓ Successfully prefixified css file');

                console.log('All done! 🎉');
            } catch (error) {
                console.error('Error:', error);
                process.exit(1);
            }
        });

    await program.parseAsync();
}
main()