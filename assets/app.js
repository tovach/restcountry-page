//Global constants
let searchedCountries = [];

//Dom elements
const form = document.querySelector(".form");
const formInput = document.querySelector(".form__input");
const clearListBtn = document.querySelector(".top__clear-list");
const list = document.querySelector(".list");
const popUp = document.querySelector(".pop-up");

//http client
const getData = async (url) => {
  let data;
  let errorMessage;
  let errorCode;
  let status = false;

  try {
    const response = await fetch(url);
    if (response.ok) {
      const json = await response.json();
      data = json;
      status = true;
    } else {
      errorCode = response.status;
      throw new Error(`${response.status} - ${response.statusText}`);
    }
  } catch (error) {
    errorMessage = error;
    console.error(error);
  }
  return { data, status, errorMessage, errorCode };
};

//get country info
const getCountry = async (countryName) => {
  const url = `https://restcountries.com/v3.1/name/${countryName}?fullText=true`;
  const { data, status, errorMessage, errorCode } = await getData(url);
  if (status) {
    const [country] = data;
    const {
      flags: { svg: flagIcon },
      name: { common: commonName },
      currencies,
      population,
      borders,
    } = country;

    const capital = country.capital || "?";
    setCountry(
      flagIcon,
      commonName,
      capital,
      currencies[Object.keys(currencies)]["name"],
      currencies[Object.keys(currencies)]["symbol"],
      population,
      borders
    );
  } else {
    if (errorCode) {
      popUpToggler("Error! Check country full name");
    } else {
      popUpToggler(errorMessage.message);
    }
  }
};

//insert country cart
const setCountry = (
  flagIcon,
  commonName,
  capital,
  currencyName,
  currencySymbol,
  population,
  borders
) => {
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
                    <span class="currency__name">${currencyName}</span> - 
                    <span class="currency__symbol">${
                      currencySymbol || "?"
                    }</span>
                  </p>
                  <span class="country__population">${population}</span>
                </div>
                <div class="country__neighbors neighbors" data-borders="${borders}">
                  <h4 class="neighbors__heading">Neighbors</h4>
                  <ul class="neighbors__list"></ul>
                </div>
            </article>
       </li>
  `;
  list.insertAdjacentHTML("beforeend", html);
  setCountriesListener();
};

//update listneres
const setCountriesListener = () => {
  const countries = document.querySelectorAll(".country");
  countries.forEach((country) =>
    country.removeEventListener("click", countryClickHandler)
  );
  countries.forEach((country) =>
    country.addEventListener("click", countryClickHandler)
  );
};

//get neighbor
const getNeighbor = async (countryCode, clickedCountry) => {
  const url = `https://restcountries.com/v3.1/alpha/${countryCode}`;
  const { data, errorCode, status } = await getData(url);
  if (status) {
    const [country] = data;
    const {
      flags: { svg: flagIcon },
      name: { common: commonName },
      cca3,
      // capital: [capital],
      currencies,
      population,
      borders,
    } = country;

    const capital = country.capital || "?";
    const neighborObj = {
      flagIcon,
      commonName,
      cca3,
      capital,
      currencies,
      population,
      borders,
    };

    setNeighbor(neighborObj, clickedCountry);
  } else {
    popUpToggler("Error! Neighbors ?");
  }
};

//set neighbor
const setNeighbor = (neighborObj, clickedCountry) => {
  const {
    flagIcon,
    commonName,
    cca3,
    capital,
    currencies,
    population,
    borders,
  } = neighborObj;

  const neighbors = clickedCountry.querySelector(".neighbors");
  const neighborsList = clickedCountry.querySelector(".neighbors__list");

  const html = ` 
  <li class="neighbors__item">
    <div class="neighbors__flag">
      <img src="${flagIcon}">
    </div>
    <h5 class="neighbors__name">${cca3}</h5>
  </li>`;
  neighborsList.insertAdjacentHTML("beforeend", html);
};

//neigbor toggler
const neighborToggler = (clickedCountry) => {
  const neighbors = clickedCountry.querySelector(".neighbors");

  clickedCountry.classList.toggle("active");
  neighbors.classList.toggle("active");
};

// Neighbors handler
const countryClickHandler = (e) => {
  const neighborsList = e.currentTarget.querySelector(".neighbors__list");
  const neighbors = e.currentTarget.querySelector(".neighbors");
  const borders = neighbors.dataset["borders"].split(",");

  if (neighborsList.childNodes.length) {
    neighborToggler(e.currentTarget);
  } else {
    for (const neighbor of borders) {
      console.log();
      getNeighbor(neighbor, e.currentTarget);
    }
    neighborToggler(e.currentTarget);
  }
};

//Clear list
const clearList = () => {
  searchedCountries = [];
  list.innerHTML = "";
  clearListBtn.style.display = "none";
};

//Form handler
const handleForm = (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const formProps = Object.fromEntries(formData);
  const { "country-name": countryName } = formProps;

  const isExist = searchedCountries.some(
    (country) => country === countryName.toLowerCase()
  );
  if (!isExist) {
    formInput.setCustomValidity("");
    searchedCountries.push(countryName);
    getCountry(countryName);
    clearListBtn.style.display = "block";
    e.target.reset();
  } else {
    e.target.reset();
    popUpToggler("Country already exists in list!");
  }
};

const popUpToggler = (message) => {
  popUp.querySelector(".pop-up__heading").innerText = message;
  popUp.classList.add("active");
  setTimeout(() => {
    popUp.classList.remove("active");
    popUp.querySelector(".pop-up__heading").innerText = "";
  }, 2000);
};

//Main event listeners
form.addEventListener("submit", handleForm);
clearListBtn.addEventListener("click", clearList);
