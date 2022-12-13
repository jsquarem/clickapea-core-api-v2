const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));


async function convertRecipeImageOnImport(url = '', data = {}) {
  try {
    const res = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    res.status(201).json();
  } catch (err) {
    console.error(err)
  }
}

module.exports = {
  convertRecipeImageOnImport
};

