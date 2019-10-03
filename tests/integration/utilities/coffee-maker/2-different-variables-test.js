import makeFavouriteCoffee from 'lightning/utilities/coffee-maker';
import { module, test } from 'qunit';
import Pretender from 'pretender';

const headers = { 'content-type': 'application/json' };

module('Integration | Utility | coffee maker', function() {
  module('2. Using some arbitrary variables', function(hooks) {
    let server;

    hooks.afterEach(function() {
      if (server) {
        server.shutdown();
      }
    });

    test('The API calls are made in the correct order', async function(assert) {
      assert.expect(16);

      const userName = 'Francesca';
      const favouriteBeverage = 'cappuccino';
      const expectedBeanVariety = 'regular espresso roast';
      const expectedServings = 1;
      const expectedMessage = 'Your coffee is ready!';

      let didGetUserPrefs = false;
      let didPostBuyBeans = false;
      let didPostBrew = false;

      server = new Pretender(function() {
        this.get('https://cloud-coffee-service.example.com/user-prefs', request => {
          assert.equal(didGetUserPrefs, false, 'user-prefs call not made yet');
          assert.equal(didPostBuyBeans, false, 'buy-beans call not made yet');
          assert.equal(didPostBrew, false, 'brew call not made yet');

          didGetUserPrefs = true;

          assert.equal(request.queryParams.userName, userName, 'Made user-prefs call with correct userName');

          return [200, headers, JSON.stringify({ favouriteBeverage })];
        });

        this.post('https://bean-market.example.com/buy-beans', request => {
          assert.equal(didGetUserPrefs, true, 'user-prefs call already made');
          assert.equal(didPostBuyBeans, false, 'buy-beans call not made yet');
          assert.equal(didPostBrew, false, 'brew call not made yet');

          didPostBuyBeans = true;

          assert.deepEqual(JSON.parse(request.requestBody), {
            beanVariety: expectedBeanVariety,
            servings: expectedServings,
          }, 'Made buy-beans call with correct body');

          return [204];
        });

        this.post('https://iot-coffee-machine.example.com/brew', request => {
          assert.equal(didGetUserPrefs, true, 'user-prefs call already made');
          assert.equal(didPostBuyBeans, true, 'buy-beans call already made');
          assert.equal(didPostBrew, false, 'brew call not made yet');

          didPostBrew = true;

          assert.deepEqual(JSON.parse(request.requestBody), {
            beverageName: favouriteBeverage,
            beanVariety: expectedBeanVariety,
          }, 'Made brew call with correct body');

          return [201, headers, JSON.stringify({ message: expectedMessage })];
        });
      });

      const message = await makeFavouriteCoffee(userName);

      assert.equal(message, expectedMessage, 'Returned the correct message');

      assert.equal(didGetUserPrefs, true, 'user-prefs call made');
      assert.equal(didPostBuyBeans, true, 'buy-beans call made');
      assert.equal(didPostBrew, true, 'brew call made');
    });
  });
});
