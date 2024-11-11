import fs from 'fs';
import path from 'path';

import { PluginObj, NodePath, transformFileSync } from "@babel/core";
import * as t from "@babel/types";


let _TW_PREFIX: string
let _TW_PREFIX_IGNORE: string

let prefixifyOneSelector = (s: string) => {
    if (s.startsWith(_TW_PREFIX_IGNORE)) {
        return s.substring(_TW_PREFIX_IGNORE.length,) // eg @@scope -> scope
    }

    let lastColon = s.lastIndexOf(':')
    let selector = s.substring(0, lastColon + 1) // eg hover:
    let className = s.substring(lastColon + 1,) // eg mx-5
    return `${selector}${_TW_PREFIX}${className}`
}

// transforms strings, template literals, conditionals, etc
function withPrefixAdded(expr: t.Expression): t.Expression {

    // "x y z" or 'x y z'
    if (t.isStringLiteral(expr)) {
        const value = expr.value;
        const newValue = value.split(/[\s\n]+/g).map(s => !s ? '' : prefixifyOneSelector(s)).join(' ');
        return t.stringLiteral(newValue);
    }

    //`x y ${z} a b`;
    if (t.isTemplateLiteral(expr)) {

        // quasis are: "x y ", " a b", they're type TemplateElement
        // map over each quasi and put ${TW_PREFIX} in front of it
        const newQuasis: t.TemplateElement[] = expr.quasis.map(quasi => {
            const value = quasi.value.raw
            const newVal = value.split(/[\s\n]+/g).map(s => !s ? '' : prefixifyOneSelector(s)).join(' ')
            return t.templateElement({ raw: newVal, cooked: newVal }, quasi.tail)
        })

        // expressions are: z, they're type Expression | TSType (no idea what TSType is)
        // map over each expr, adding prefix to it
        const newExpressions: (t.Expression | t.TSType)[] = expr.expressions.map(e => {
            if (!t.isExpression(e))
                return e
            return withPrefixAdded(e)
        })


        return t.templateLiteral(newQuasis, newExpressions);
    }

    // something ? `py-5 pb-2` : `py-2`
    if (t.isConditionalExpression(expr)) {
        return t.conditionalExpression(expr.test, withPrefixAdded(expr.consequent), withPrefixAdded(expr.alternate))
    }

    // default is to return expr as is (do nothing)
    return expr
}


const prefixifyBabelPlugin: PluginObj = {
    name: "prefixify-className-transformer",
    visitor: {
        JSXAttribute(path) {
            if (t.isJSXIdentifier(path.node.name) && path.node.name.name === "className") {
                const valuePath = path.get('value');
                // Expression className=''
                if (t.isExpression(valuePath.node)) {
                    valuePath.replaceWith(withPrefixAdded(valuePath.node));
                }
                // JSXExpressionContainer className={}
                else if (t.isJSXExpressionContainer(valuePath.node)) {
                    let e = valuePath.node.expression
                    if (t.isJSXEmptyExpression(e)) return
                    valuePath.replaceWith(t.jsxExpressionContainer(withPrefixAdded(e)));
                }
            }
        }
    }
};

export const prefixify = (dir: string, out: string, TW_PREFIX?: string, TW_PREFIX_IGNORE?: string) => {
    // define globally so we don't have to pass it around
    if (TW_PREFIX !== undefined)
        _TW_PREFIX = TW_PREFIX
    if (TW_PREFIX_IGNORE !== undefined)
        _TW_PREFIX_IGNORE = TW_PREFIX_IGNORE

    if (!fs.existsSync(out)) {
        fs.mkdirSync(out, { recursive: true });
    }

    const files = fs.readdirSync(dir);

    for (let fileName of files) {
        const filePath = path.join(dir, fileName);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            prefixify(filePath, path.join(out, fileName));
            continue
        }

        const outPath = path.join(out, fileName);

        // jsx files are the only ones with className=...
        let isJSXFile = stat.isFile() && /\.(jsx|tsx)$/.test(fileName)
        if (isJSXFile) {
            const result = transformFileSync(filePath, {
                plugins: [prefixifyBabelPlugin],
                parserOpts: { plugins: ['jsx', 'typescript'] },
                generatorOpts: { retainLines: true },
                configFile: false,
                babelrc: false,
            });
            fs.writeFileSync(outPath, result?.code ?? '');
        }
        // just copy the file over
        else {
            fs.copyFileSync(filePath, outPath);
        }


    }
};
