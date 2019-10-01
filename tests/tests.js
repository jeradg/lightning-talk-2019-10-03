import setupTests from './setup-tests.js';

setupTests(window);

import '../node_modules/pretender/dist/pretender.js';

import makeFavouriteCoffee from '../app/coffee-maker.js';

const {
  module,
  test,
} = QUnit;

const headers = { 'content-type': 'application/json' };

module('Not using assert.step', function(hooks) {
  let server;

  hooks.afterEach(function() {
    if (server) {
      server.shutdown();
    }
  });

  test('The API calls are made in the correct order', async function(assert) {
    
  });
});

module('Using assert.step', function(hooks) {
  let server;

  hooks.afterEach(function() {
    if (server) {
      server.shutdown();
    }
  });

  test('The API calls are made in the correct order', async function(assert) {
    const userName = 'Francesca';
    const favouriteBeverage = 'cappuccino';
    const expectedBeanVariety = 'regular espresso roast';
    const expectedServings = 1;
    const expectedMessage = 'Your coffee is ready!';

    server = new Pretender(function() {
      this.get('https://cloud-coffee-service.example.com/user-prefs', request => {
        assert.step('user-prefs');

        return [200, headers, JSON.stringify({ favouriteBeverage })];
      });

      this.post('https://bean-market.example.com/buy-beans', request => {
        assert.step('buy-beans');

        assert.deepEqual(request.body, {
          beanVariety: expectedBeanVariety,
          servings: expectedServings,
        });

        return [204];
      });

      this.post('https://iot-coffee-machine.example.com/brew', request => {
        assert.step('brew');

        assert.deepEqual(request.body, {
          beverageName,
          beanVariety: expectedBeanVariety,
        });

        return [201, headers, JSON.stringify({ message: expectedMessage })];
      });
    });

    const message = await makeFavouriteCoffee(userName);

    assert.equal(message, expectedMessage);

    assert.verifySteps(['user-prefs', 'buy-beans', 'brew']);
  });
});
