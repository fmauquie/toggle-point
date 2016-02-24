Toggle Point
============

Allows toggling a function or object on any condition.

(right now, only function toggle is supported,
 with support for async functions and generators.)

Written in ES6 for Node5. Support for node4 and browsers will be coming soon

## Usage
```js
import togglePoint from 'toggle-point';

function myFunctionToToggle(param) {
  return param;
}

const myToggledFunction = togglePoint(myFunctionToToggle, {
  when: (param) => param === 1,
  then: (param) => -1
});
```

`myToggledFunction`, when called, will either use the original function
(when the param is anything but `1`), or use the alternative version
(if the param is `1`)

Of course in real life, you would rather toggle depending on some context (user rights, feature activation …)

## Modes

By default both the `when` and `then` are synchronous. You can use `async` functions too
(or anything that returns a promise), by specifying `mode: togglePoint.mode.async`:

```js
import togglePoint from 'toggle-point';

async function myFunctionToToggle(param) {
  return await Promise.resolve(param);
}

const myToggledFunction = togglePoint(myFunctionToToggle, {
  when: async (param) => await param === 1,
  then: async (param) => await Promise.resolve(-1)
});
```

The `when` function does not need to be async for this to work.

There is also a `generator` mode that allows you to toggle generator functions.
Note that in generators the `when` function must be synchronous, as to not pollute the `yield` results:

```js
import togglePoint from 'toggle-point';

function* myFunctionToToggle(param) {
  yield 1;
  yield 2;
  return param;
}

const myToggledFunction = togglePoint(myFunctionToToggle, {
  when: (param) => param === 1,
  * then(param) {
    yield 4;
    yield 1;
    return yield param;
  }
});
```

The complete list of modes right now is:

(`togglePoint.mode.`...)
- `sync`: Synchronous function, toggle and alternative. The default
- `async`: Asynchronous function, toggle and alternative. Any one of them may actually be synchronous
- `generator`: Generator function and alternative. Toggle must be synchronous.

## Testing

The lib is 100% unit-tested using Mocha and Chai. It is developed in TDD.

## Roadmap

- Toggle objects, method by method
- Toggle object properties
- Do some performance testing
- Make a version that can run on Node4 and browsers
- Deploy on npm registry (once it looks good and well documented)
- Develop a companion feature management library to have a complete feature toggle system
- Use it on real production code (there's a reason why I'm developing this :) )

## Building and helping

Clone the project,
```
npm install
```

In one terminal window:
```
npm run build:watch
```

In another terminal window:
```
npm run test:watch
```

All contributions and issues are welcome !
