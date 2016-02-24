/**
 * @template {T}
 * @param objectOrFunction {T}
 * @param config Config
 * @return {T}
 */
export default function togglePoint(objectOrFunction, config) {
  if (!objectOrFunction) {
    throw new Error('Toggle point configuration requires an object or function to toggle on.');
  }
  if (!config) {
    throw new Error('Toggle point configuration requires a configuration object.');
  }
  const mode = config.mode || togglePoint.mode.sync;

  return transforms[mode](objectOrFunction, config.when, config.then);
}

togglePoint.mode = {
  sync: 'sync',
  async: 'async',
  generator: 'generator',
};

const transforms = {
  [togglePoint.mode.sync]: function syncToggle(func, when, then) {
    return function(...args) {
      return when.call(this, ...args)
        ? then.call(this, ...args)
        : func.call(this, ...args);
    };
  },
  [togglePoint.mode.async]: function asyncToggle(func, when, then) {
    return async function(...args) {
      // We must extract "toggle" because Babel transpiles into a generator and forgets parenthesis around the "yield",
      // which makes the condition always true :(
      const toggle = await when.call(this, ...args);

      return toggle
        ? (await then.call(this, ...args))
        : (await func.call(this, ...args));
    };
  },
  [togglePoint.mode.generator]: function generatorToggle(func, when, then) {
    return function*(...args) {
      const toggle = when.call(this, ...args);

      return toggle ? (yield* then.call(this, ...args)) : (yield* func.call(this, ...args));
    };
  },
};
