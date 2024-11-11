
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


## Using
To run, use:

```
scopify-tailwind ./src  # source to scopify is first arg
-n ./src2               # intermediate folder that will be created
-p "prefix-"            # prefix to use (this prevents styles from leaking out)
-s "scope"              # className in which prefixed styles will be applied (this prevents styles from leaking in) 
-g "@@"                 # if a class has this prefix, it won't be prefixed. By default, to start using the styles, use className="@@scope".
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
src                                     src2
className="h-3 my-2 @@myclass"       -->           className="prefix-h-3 prefix-my-2 myclass"
```



2. Then, we scopify:
```
src2/styles.css                   src2/styles.css                     src2/styles.css
@tailwind base      -->           .h-3 { }              -->           .prefix-h-3 { }
```



## Building

If you make any changes to scopify-tailwind as a contributor, just run `npm run build`.
