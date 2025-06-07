# Scope-Tailwind
This project is designed for cases where you want to drop Tailwind into a part of your project without messing up the other styles. 

**We prevent Tailwind style leaks out of your Tailwind**. Our generated CSS files only apply *inside* your desired elements. You can even use preflight without causing any global style leaks. 

**We prevent global style leaks into your Tailwind**. We auto-prefix classNames inside of your desired elements so global classNames won't leak in. You don't have to write "prefix-" in front of every class, this is automatic!


## Using Scope-Tailwind


To use Scope-Tailwind, run `scope-tailwind` in the terminal. Here are all the options:

```bash
scope-tailwind ./src    # the source folder with your jsx/tsx files (required)
-p "prefix-"            # prefix to use
-s "scope"              # we only apply TW styles inside elements with this class as an ancestor
-g "@@"                 # we never prefix elements that start with this
-o ./src2               # the output directory that will be created
```

Your styles will not appear unless you add an element with class `"scope"`, or disable scoping with `-s ""`. 

The prefix you specify must agree with the prefix in `tailwind.config.js`.



## Example
Run `scope-tailwind` and we'll convert your TSX/JSX files which look like this:

```tsx
function MyComponent() {
    return <div className='my-5 mt-2 bg-red-500 @@dont-prefix-this'>
       Hello
    </div>
}
```

Into files that look like this:

```tsx
function MyComponent() {
    return <div className='prefix-my-5 prefix-mt-2 prefix-bg-red-500 dont-prefix-this'>
        Hello
    </div>
}
```

And we'll convert your CSS files that look like this:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Into files that look like this:
```css
.scope *, .scope ::before, .scope ::after {
  --tw-border-spacing-x: 0;
  /* ... other generated TW styles, now scoped to "scope" className ... */
}
```

## Caveats
If you have complex className logic with a lot of variables, scope-tailwind is not a good fit right now, because we only add prefixes to strings *inside* `className=...`, not outside. 
For example, this works with scope-tailwind:
```tsx
<div className={isHidden ? 'hidden' : `my-2 px-3 ${isFlex ? 'flex flex-col gap-2' : 'block'}`}>
```

But the following WILL NOT work:

```tsx
const myStyles = 'my-5 py-5 mt-2 bg-red-500'
<div className={myStyles}>
```

We can fix this by adding a dummy symbol so you can tell `scope-tailwind` to prefixify strings outside className, but we haven't gotten to this yet.

## Details

Here's what goes on behind the scenes.

1. First, we prefixify:
```raw
src                                                src2
className="h-3 my-2 @@myclass"       -->           className="prefix-h-3 prefix-my-2 myclass"
```



2. Then, we scopify:
```raw
src2/styles.css                   src2/styles.css                     src2/styles.css
@tailwind base      -->           .h-3 { }              -->           .prefix-h-3 { }
```


## Building

If you make any changes to this repo as a contributor, just run `npm run build` to re-compile the build.
To test your changes, the easiest thing to do is run `npm link`, which installs the project globally as if you installed it from npm. Run `npm run refreshlink` to refresh.

If you want to understand how the tool works, just open up the generated `src2/` folder and look at the css file and the classNames. If you have any questions or suggestions, feel free to reach out at support@voideditor.com.

