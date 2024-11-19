
# Scope-Tailwind

This project allows you to prefix and scope your CSS files so there are no style leaks from Tailwind's CSS files. You can even use preflight without causing global style leaks. 

Simply run `scope-tailwind` and we'll convert your files, which look something like this:

```tsx
function MyComponent() {
    return <div className='my-5 mt-2 bg-red-500'>
       Hello
    </div>
}
```

Into files that look like this:

```tsx
function MyComponent() {
    return <div className='prefix-my-5 prefix-mt-2 prefix-bg-red-500'>
        Hello
    </div>
}
```

We also build your Tailwind file (the one that has `@tailwind base`, etc) so that everything has the same prefixes. This lets you avoid having to manually prefix all your classNames when using Tailwind. 

We don't just prefix your classNames - we also make Tailwind only apply to elements inside a special className (details below). This means Tailwind is truly scoped, and not even global styles leak out. 

## Using Scope-Tailwind

To use Scope-Tailwind, run `scope-tailwind` in the terminal. The source directory is the only required parameter. Here are all the options:

```bash
scope-tailwind ./src    # (required) the source folder with jsx/tsx files to scopify

-o ./src2               # the output directory that will be created

-p "prefix-"            # prefix to use (this prevents styles from leaking out)

-s "scope"              # your styles will only apply if they're in an element with this 
                        # className. This prevents Tailwind's global styles from leaking out

-g "@@"                 # if a className starts with this string, it won't be prefixed. For 
                        # example, "@@myclass" will become "myclass", not "prefix-myclass"
```

You can disable scoping by adding the flag `-s ""`. If you don't disable it, you must create an element with the className "scope" (or whatever is in `-s`) in order for your styles to appear. 

The prefix you specify in this command must agree with the prefix in `tailwind.config.js`.

## Caveats

We only add prefixes to strings *inside* className, not outside.
For example, this works with scope-tailwind:
```tsx
<div className={isHidden ? 'hidden' : `my-2 px-3 ${isFlex ? 'flex flex-col gap-2' : 'block'}`}>
```

But the following WILL NOT work:

```tsx
const the_styles_to_add = 'my-5 py-5 mt-2 bg-red-500'
<div className={the_styles_to_add}>
```

We typically don't have complex className logic in our projects, and can fit everything into `className=` tags, so this is not a pain for us. If you have complex className logic, scope-tailwind is not a good fit.


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


We recommend running scope-tailwind to convert your src/ into src2/, and then using a tool like `tsup` to bundle your files.


## Building

If you make any changes to this repo as a contributor, just run `npm run build` to re-compile the build.
To test your changes, the easiest thing to do is run `npm link`, which installs the project globally as if you installed it from npm. Run `npm run refreshlink` to refresh.

If you want to understand how the tool works, we recommend opening up src2/ and looking at the css file and the classNames of the new tsx files. If you have any questions or suggestions, feel free to reach out at support@voideditor.com.

