
# Scopify-Tailwind

This project allows you to apply Tailwind styles to a subset of files without having style leaks.

Simply run `scopify-tailwind` and we'll convert files like this:

```
let MyComponent = () => {
    return <div className='my-5 py-5 mt-2 bg-red-500'>
        Hello World!
    </div>
}
```
Into files like this:
```
let MyComponent = () => {
    return <div className='prefix-my-5 prefix-py-5 prefix-mt-2 prefix-bg-red-500'>
        Hello World!
    </div>
}
```


## Using Scopify-Tailwind
To run the tool, run `scopify-tailwind` in the terminal. The source file is the only required parameter. Here are all the options:

```
scopify-tailwind ./src  # (required) the source folder with jsx/tsx files to scopify 
-p "prefix-"            # prefix to use (this prevents styles from leaking out)
-g "@@"                 # if a class starts with this, it won't be prefixed. For example, "@@myclass" will be converted to "myclass", not "prefix-myclass"
-o ./src2               # name of the output folder that will be created
-s ""                   # If this is included, styles will only work inside an HTMLElement with this className. Defaults to nothing. 
```


## Caveats
We add a prefix to all raw strings found *inside* className. 

For example, this works:
```
let MyComponent = () => {
    // This works!
    let isHidden = useState(false)
    return <div className={isHidden ? 'hidden' : 'block'}>
        Hello World!
    </div>
}
```

But the following WILL NOT work:

```
let MyComponent = () => {
    // This does not work! The string is not inside className.
    const myClass = 'my-5 py-5 mt-2 bg-red-500'
    return <div className={myClass}>
        Hello World!
    </div>
}
```

We don't have much logic for our classNames, so this works for us.


## Details

Here's what goes on behind the scenes.

1. First, we prefixify:
```
src                                                src2
className="h-3 my-2 @@myclass"       -->           className="prefix-h-3 prefix-my-2 myclass"
```



2. Then, we scopify:
```
src2/styles.css                   src2/styles.css                     src2/styles.css
@tailwind base      -->           .h-3 { }              -->           .prefix-h-3 { }
```



## Building

If you make any changes to this repo as a contributor, just run `npm run build` to re-compile the build.

To test your changes, the easiest thing to do is run `npm link`, which installs the project globally as if you installed it from npm. Run `npm run refreshlink` to refresh.

If you want to understand how the tool works, we recommend opening up src2/ and looking at the css file and the classNames of the new tsx files. If you have any questions or suggestions, feel free to reach out at support@voideditor.com.

