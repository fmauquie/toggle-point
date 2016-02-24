import { expect } from 'chai';
import togglePoint from './index';

describe('togglePoint', function() {
  it('should be a function with 2 arguments', function() {
    expect(togglePoint).to.be.a('function');
    expect(togglePoint.length).to.equal(2);
  });

  it('should require the use of the arguments', function() {
    expect(togglePoint.bind(null)).to.throw(Error);
  });

  it('should require a configuration', function() {
    expect(togglePoint.bind(null, {})).to.throw(Error);
  });

  describe('function toggle', function() {
    const functionToToggle = function(param1) {
      return param1 + (this.count) + 1;
    };
    const toggleConfiguration = {
      when: (param1) => param1 === 1,
      then: function() {
        return this.count;
      }
    };

    it('returns a new function', function() {
      const toggledFunction = togglePoint(functionToToggle, toggleConfiguration);

      expect(toggledFunction).to.be.a('function');
      expect(toggledFunction).to.not.equal(functionToToggle);
    });

    it('returns a function that passes through if it does not toggle', function() {
      const toggledFunction = togglePoint(functionToToggle, toggleConfiguration);

      expect(toggledFunction.call({ count: 1 }, 2)).to.equal(4);
    });

    it('toggles the function when condition is fulfilled', function() {
      const toggledFunction = togglePoint(functionToToggle, toggleConfiguration);

      expect(toggledFunction.call({ count: 155 }, 1)).to.equal(155);
    });
  });

  describe('async function toggle', function() {
    const result = Promise.resolve(1);
    const functionToToggle = async function(param1) {
      return param1 + (this.count) + (await result);
    };
    const toggleConfiguration = {
      mode: togglePoint.mode.async,
      when: async function(param1) {
        return param1 === await result;
      },
      then: async function() {
        return await result;
      }
    };

    it('returns a function that passes through if it does not toggle', async function() {
      const toggledFunction = togglePoint(functionToToggle, toggleConfiguration);

      expect(await toggledFunction.call({ count: 1 }, 2)).to.equal(4);
    });

    it('toggles the function when condition is fulfilled', async function() {
      const toggledFunction = togglePoint(functionToToggle, toggleConfiguration);

      expect(await toggledFunction.call({ count: '' }, 1)).to.equal(1);
    });
  });

  describe('generator function toggle', function() {
    const functionToToggle = function*(param1) {
      yield 1;
      yield 2;
      return param1;
    };
    const toggleConfiguration = {
      mode: togglePoint.mode.generator,
      when: function(param1) {
        return param1 === 1;
      },
      * then() {
        yield 3;
        return 1;
      }
    };

    it('returns a generator that passes through if it does not toggle', function() {
      const toggledFunction = togglePoint(functionToToggle, toggleConfiguration);

      const results = [...toggledFunction(2)];
      expect(results).to.deep.equal([1, 2]);
    });

    it('toggles the function when condition is fulfilled', function() {
      const toggledFunction = togglePoint(functionToToggle, toggleConfiguration);

      const results = [...toggledFunction(1)];
      expect(results).to.deep.equal([3]);
    });
  });
});
