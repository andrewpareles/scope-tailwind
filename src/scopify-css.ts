

import * as fs from 'fs';
import * as path from 'path';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import postcssNested from 'postcss-nested';

import util from 'util'
import { exec } from 'child_process'

export async function scopify(src2: string, cssPathFromSrc2: string, scopeName: string, TW_PREFIX: string) {

    // generate the tailwind css file
    const fullCssPath = path.join(src2, cssPathFromSrc2)

    let content = (await util.promisify(exec)(`tailwindcss -i ${fullCssPath} --prefix "${TW_PREFIX}"`)).stdout

    // only scopify if the scope exists (it's not '')
    if (scopeName) {
        content = `.${scopeName} {\n${content}\n}`;
        content.replace(':root', '&')
    }

    content = postcss([autoprefixer, postcssNested]).process(content, { from: undefined }).css;

    fs.writeFileSync(fullCssPath, content);
}

