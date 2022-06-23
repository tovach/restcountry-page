const url = "https://restcountries.com/v3.1/name/russia";

//http client
const getData = async (url) => {
  let data;
  let error;
  let status = false;

  try {
    const response = await fetch(url);
    if (response.ok) {
      const json = await response.json();
      data = json;
      status = true;
    } else {
      throw new Error(response.status);
    }
  } catch (error) {
    error = `Fetch error : ${response.status} - ${response.statusText}`;
    console.log(`Fetch error : ${response.status} - ${response.statusText}`);
  }
  return { data, status, error };
};

const setCountry = async () => {};

//Main function
const main = () => {};

document.addEventListener("DOMContentLoaded", main);
