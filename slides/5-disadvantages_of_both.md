# Disadvantages of using counters or tracking variables

- Boilerplate/need to decide how to approach each time.
- More variables required (usually).
- Harder to grok the test. (Understanding the variables/counter is a bit less obvious.)
- Really need to rely on `assert.expect(N)` to make sure an API call isn't made multiple times.
