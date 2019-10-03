# Using `assert.step()`/`assert.verifySteps()`

- No boilerplate for setting up variables.
- No additional variables required in the test.
- Easier to read.
- Don't need to use `assert.expect(N)`. (`assert.verifySteps()` fails if a step doesn't occur, happens in wrong order, or happens more than once.)
- Throws an error if you use `assert.step()` but `assert.verifySteps()` isn't called.
