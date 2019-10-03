# Lightning talk on assert.step()/assert.verifySteps()
2019-10-03

Coaching Circle onsite

Boulder, Colorado

-----

*Imagine, if you will,* a small app that controls an IOT coffee maker. The app uses a util module that has one public method, which when called with a person's name causes the coffee maker to make the person's favourite coffee-based beverage.

(See `makeFavouriteCoffee()` here: https://github.com/jeradg/lightning-talk-2019-10-03/blob/master/app/utilities/coffee-maker.js#L21)

The method makes three API calls, which must be made sequentially:

- GET that person's profile, which includes the name of their favourite beverage
- POST a call to an external service to buy the coffee beans for that beverage (don't ask why we need to do this -- the economics of coffee are weird)
- POST a call to the IOT coffee maker itself to tell it to brew the person's favourite beverage using the type of beans we just purchased. (The coffee maker doesn't know what kind of beans each drink needs, so we need to specifically tell it.)

We want to write a test to ensure they are always made in the correct order.

## Using a counter

https://github.com/jeradg/lightning-talk-2019-10-03/blob/master/tests/integration/utilities/coffee-maker/1-counter-test.js

- Not a lot of code (in a good way?)
- Semantics of the test aren't clear. (Can be hard to grok at a glance.)
- Test error messages are unclear.

## Using tracking variables

https://github.com/jeradg/lightning-talk-2019-10-03/blob/master/tests/integration/utilities/coffee-maker/2-different-variables-test.js

- Verbose. (Need more variables, and need to keep checking each of them multiple times.)
- Semantics of the test aren't clear.
- Test error messages are unclear.

## Disadvantages of using counters or tracking variables

- Boilerplate/need to decide how to approach each time.
- More variables required (usually).
- Harder to grok the test. (Understanding the variables/counter is a bit less obvious.)
- Really need to rely on `assert.expect(N)` to make sure an API call isn't made multiple times.

## Using `assert.step()`/`assert.verifySteps()`

https://github.com/jeradg/lightning-talk-2019-10-03/blob/master/tests/integration/utilities/coffee-maker/3-assert-step-test.js

- No boilerplate for setting up variables.
- No additional variables required in the test.
- Easier to read.
- Don't need to use `assert.expect(N)`. (`assert.verifySteps()` fails if a step doesn't occur, happens in wrong order, or happens more than once.)
- Throws an error if you use `assert.step()` but `assert.verifySteps()` isn't called.

## Disadvantages of `assert.step()`

- Slightly slower than the other options.
    - (The counter is fastest.)
