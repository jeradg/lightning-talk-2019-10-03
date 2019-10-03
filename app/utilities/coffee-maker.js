const headers = Object.freeze({
  'Content-Type': 'application/json',
});

const beverageBeanMap = Object.freeze({
  'cappuccino': 'regular espresso roast',
  'diner-drip': 'boring beans',
  'espresso': 'fancy espresso roast',
  'mocha': 'boring beans',
});

/*
 * The personalized Coffee Maker makes your perfect coffee based
 * on your personal preferences (stored in our cloud-based
 * coffee solution system), using the most affordable, high-quality
 * beans sourced live from the international coffee bean market.
 *
 * @param {string} userName
 * @return {string} A message to display to the user
 */
export default async function makeFavouriteCoffee(userName) {
  try {
    const {
      favouriteBeverage: beverageName,
    } = await getUserPreferences(userName);

    const beanVariety = beverageBeanMap[beverageName];

    // This must happen before the beverage is made! We need them beans!
    // A separate process loads the IOT coffee machine with the purchased beans
    await buyBeans(beanVariety);

    const { message } = await brew(beverageName, beanVariety);

    return message;
  } catch(e) {
    return 'Something went wrong';
  }
}

/*
 * @param {string} userName
 * @return {Object} The user's preferences
 */
async function getUserPreferences(userName) {
  const params = new URLSearchParams();

  params.append('userName', userName);

  const baseUrl = 'https://cloud-coffee-service.example.com/user-prefs';
  const url = `${baseUrl}?${params.toString()}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Are you sure that user exists?');
  }

  return await response.json();
}

/*
 * Resolves without a value on success. Throws on error.
 */
async function buyBeans(beanVariety, servings = 1) {
  const data = {
    beanVariety,
    servings,
  };

  const response = await fetch('https://bean-market.example.com/buy-beans', {
    method: 'POST',
    body: JSON.stringify(data),
    headers,
  });

  if (!response.ok) {
    throw new Error('Could not buy beans');
  }
}

/*
 * Tell the IOT coffee maker to make the coffee.
 *
 * @param {string} beverageName
 * @param {string} beanVariety
 * @return {Object} Status object, including a message for the user
 */
async function brew(beverageName, beanVariety) {
  const data = {
    beanVariety,
    beverageName,
  };

  const response = await fetch('https://iot-coffee-machine.example.com/brew', {
    method: 'POST',
    body: JSON.stringify(data),
    headers,
  });

  if (!response.ok) {
    throw new Error('Something went wrong! Please make sure your coffee maker is not on fire and try again.');
  }

  return await response.json();
}
