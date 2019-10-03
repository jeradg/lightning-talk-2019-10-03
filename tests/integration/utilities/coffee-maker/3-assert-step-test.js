import makeFavouriteCoffee from 'lightning/utilities/coffee-maker';
import { module, test } from 'qunit';
import Pretender from 'pretender';

const headers = { 'content-type': 'application/json' };

module('Integration | Utility | coffee maker', function() {
  module('3. Using assert.step()/assert.verifySteps()', function(hooks) {
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
          assert.step('user-prefs GET');

          assert.equal(request.queryParams.userName, userName, 'Made user-prefs call with correct userName');

          return [200, headers, JSON.stringify({ favouriteBeverage })];
        });

        this.post('https://bean-market.example.com/buy-beans', request => {
          assert.step('buy-beans POST');

          assert.deepEqual(JSON.parse(request.requestBody), {
            beanVariety: expectedBeanVariety,
            servings: expectedServings,
          }, 'Made buy-beans call with correct body');

          return [204];
        });

        this.post('https://iot-coffee-machine.example.com/brew', request => {
          assert.step('brew POST');

          assert.deepEqual(JSON.parse(request.requestBody), {
            beverageName: favouriteBeverage,
            beanVariety: expectedBeanVariety,
          }, 'Made brew call with correct body');

          return [201, headers, JSON.stringify({ message: expectedMessage })];
        });
      });

      const message = await makeFavouriteCoffee(userName);

      assert.equal(message, expectedMessage, 'Returned the correct message');

      assert.verifySteps(['user-prefs GET', 'buy-beans POST', 'brew POST']);
    });
  });
});
