# Lightning talk on assert.step()/assert.verifySteps()
2019-10-03

Coaching Circle onsite

Boulder, Colorado

## Using a counter

- Not a lot of code (in a good way?)
- Semantics of the test aren't clear. (Can be hard to grok at a glance.)
- Test error messages are unclear.

## Using tracking variables

- Verbose. (Need more variables, and need to keep checking each of them multiple times.)
- Semantics of the test aren't clear.
- Test error messages are unclear.

## Both options that aren't assert.step:

- Boilerplate/need to decide how to approach each time.
- More variables required (usually).
- Harder to grok the test. (Understanding the variables/counter is a bit less obvious.)
- Really need to rely on `assert.expect(N)` to make sure an API call isn't made multiple times.

## Advantages of assert.step:

- No boilerplate for setting up variables.
- No additional variables required in the test.
- Easier to read.
- Don't need to use `assert.expect(N)`. (`assert.verifySteps()` fails if a step doesn't occur, happens in wrong order, or happens more than once.)
- Throws an error if you use `assert.step()` but `assert.verifySteps()` isn't called.

## Disadvantages of assert.step

- Slightly slower than the other options
