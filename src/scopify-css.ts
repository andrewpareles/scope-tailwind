

import * as fs from 'fs';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import postcssNested from 'postcss-nested';

import util from 'util'
import { exec } from 'child_process'

export async function scopify(src: string, scopeName: string, TW_PREFIX: string) {
    // generate the tailwind css file
    let content = (await util.promisify(exec)(`tailwindcss -i ${src} --prefix "${TW_PREFIX}"  --content "./src2/**/*.tsx,./src2/**/*.jsx"`)).stdout
    content = `.${scopeName} {\n${content}\n}`;
    content = postcss([autoprefixer, postcssNested]).process(content, { from: undefined }).css;

    fs.writeFileSync(src, content);
}

