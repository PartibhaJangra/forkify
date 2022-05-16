import { async } from 'regenerator-runtime';
import { TIMEOUT_SECS } from './config';

// returns a new promise, which will reject afer s seconds
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// fetch data from an API and return the JSON
export const getJSON = async function (url) {
  try {
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SECS)]);

    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    console.log(err);
    throw err; // rejecting the promise, handling in model
  }
};
