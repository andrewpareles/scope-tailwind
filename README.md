
# Scope-Tailwind

This project allows you to prefix and scope your CSS files so there are no style leaks from Tailwind's CSS files. You can even use preflight without causing any style leaks. 

Simply run `scope-tailwind` and we'll convert files like this:

```tsx
function MyComponent() {
    return <div className='my-5 mt-2 bg-red-500'>
       Hello
    </div>
}
```

Into files like this:

```tsx
function MyComponent() {
    return <div className='prefix-my-5 prefix-mt-2 prefix-bg-red-500'>
        Hello
    </div>
}
```



## Using Scope-Tailwind
Simply run `scope-tailwind` in the terminal to scope your jsx/tsx files. The source directory is the only required parameter. Here are all the options:

```bash
scope-tailwind ./src    # (required) the source folder with jsx/tsx files to scopify

-o ./src2               # the output directory that will be created

-p "prefix-"            # prefix to use (this prevents styles from leaking out)

-s "scope"              # your styles will only apply if they're in an element with this 
                        # className. This prevents Tailwind's global styles from leaking out

-g "@@"                 # if a className starts with this string, it won't be prefixed. For 
                        # example, "@@myclass" will become to "myclass", not "prefix-myclass"
```


You can disable scoping by adding the flag `-s ""`. If you don't disable it, you must create an element with the className "scope" in order for your styles to appear. 

The prefix you specify here must agree with the prefix in `tailwind.config.js`.

## Caveats

We only add prefixes to strings *inside* className, not outside.
For example, this works with scope-tailwind:
```tsx
<div className={isHidden ? 'hidden' : `my-2 ${isFlex ? 'flex gap-2' : 'block'}`}>
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



## Building

If you make any changes to this repo as a contributor, just run `npm run build` to re-compile the build.
To test your changes, the easiest thing to do is run `npm link`, which installs the project globally as if you installed it from npm. Run `npm run refreshlink` to refresh.

If you want to understand how the tool works, we recommend opening up src2/ and looking at the css file and the classNames of the new tsx files. If you have any questions or suggestions, feel free to reach out at support@voideditor.com.

