const list = document.querySelector(".list");
const form = document.querySelector(".form");
const clearListBtn = document.querySelector(".top__clear-list");

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
      throw new Error(`${response.status} - ${response.statusText}`);
    }
  } catch (error) {
    console.error(error);
  }
  return { data, status, error };
};

//insert country cart
const setCountry = async (countryName) => {
  const url = `https://restcountries.com/v3.1/name/${countryName}`;
  const { data, status } = await getData(url);
  if (status) {
    let [country] = data;
    let {
      flags: { svg: flagIcon },
      name: { common: commonName },
      capital: [capital],
      currencies,
      population,
    } = country;
    const html = `
      <li class="list__item">
            <article class="country">
                <div class="country__flag">
                  <img src="${flagIcon}" alt="${commonName}">
                </div>
                <div class="country__info">
                  <h3 class="country__name">${commonName}</h3>
                  <h5 class="country__capital">${capital}</h5>
                  <p class="country__currency currency">
                    <span class="currency__name">${
                      currencies[Object.keys(currencies)]["name"]
                    }</span> - 
                    <span class="currency__symbol">${
                      currencies[Object.keys(currencies)]["symbol"] || "?"
                    }</span>
                  </p>
                  <span class="country__population">${population}</span>
                </div>
            </article>
       </li>
  `;
    list.insertAdjacentHTML("beforeend", html);
  }
};

//Clear list
const clearList = () => {
  list.innerHTML = "";
  clearListBtn.style.display = "none";
};

//Form handler
const handleForm = (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const formProps = Object.fromEntries(formData);
  const { "country-name": countryName } = formProps;
  setCountry(countryName);
  clearListBtn.style.display = "block";
  e.target.reset();
};

//Main function
const main = () => {};

//Event listeners
document.addEventListener("DOMContentLoaded", main);
form.addEventListener("submit", handleForm);
clearListBtn.addEventListener("click", clearList);
