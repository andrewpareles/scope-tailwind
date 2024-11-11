
# Scope-Tailwind

This project allows you to apply Tailwind styles to a subset of files without having style leaks.

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

We prefix and scope your CSS files so there are no CSS leaks from Tailwind. You can even use preflight without causing any style leaks. 


## Using Scope-Tailwind
Run `scope-tailwind` in the terminal to prefix/scope your jsx/tsx files. The source directory is the only required parameter. Here are all the options:

```bash
scope-tailwind ./src  # (required) the source folder with jsx/tsx files to scopify
-o ./src2               # the output directory that will be created
-p "prefix-"            # prefix to use (this prevents styles from leaking out)
-s "scope"              # styles will only apply in an HTMLElement with this className. This prevents Tailwind's global styles from leaking out
-g "@@"                 # if a class starts with this, it won't be prefixed. For example, "@@myclass" will be converted to "myclass" instead of "prefix-myclass"
```


Styles are "scoped" to an element by default so that global Tailwind styles don't leak out. This means you need an element with the class "scope" in order for the styles to apply. Or, you can just disable scoping by adding the flag `-s ""`. 

The prefix specified must agree with your tailwind.config.js `prefix` field.

## Caveats
We add a prefix to all the raw strings that are found inside className, so everything needs to happen inside className tags.

For example, this works with scope-tailwind:
```tsx
<div className={isHidden ? 'hidden' : `${isFlex ? 'flex' : 'block'}`}>
```

But the following WILL NOT work:

```tsx
const the_styles_to_add = 'my-5 py-5 mt-2 bg-red-500'
<div className={the_styles_to_add}>
```

We typically don't have complex className logic in our projects, and can fit everything into `className=` tags, so this works for us.


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

