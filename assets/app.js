const form = document.querySelector(".form");
const clearListBtn = document.querySelector(".top__clear-list");

const list = document.querySelector(".list");

//http client
const getData = async (url) => {
  let data;
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
    console.error(error);
  }
  return { data, status, errorCode };
};

//get country info
const getCountry = async (countryName) => {
  const url = `https://restcountries.com/v3.1/name/${countryName}?fullText=true`;
  const { data, errorCode, status } = await getData(url);
  if (status) {
    let [country] = data;
    let {
      flags: { svg: flagIcon },
      name: { common: commonName },
      capital: [capital],
      currencies,
      population,
      borders,
    } = country;
    setCountry(
      flagIcon,
      commonName,
      capital,
      currencies[Object.keys(currencies)]["name"],
      currencies[Object.keys(currencies)]["symbol"],
      population,
      borders
    );
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
                <div class="country__neighbors neighbors">
                  <h4 class="neighbors__heading">Neighbors</h4>
                  <ul class="neighbors__list">
                    ${borders.map((neighbor) => {
                      return `<li class="neighbors__item">
                      <div class="neighbors__flag">
                        <img src="https://flagcdn.com/se.svg">
                      </div>
                      <h5 class="neighbors__name">${neighbor}</h5>
                    </li>`;
                    }).join('\n')}
                  </ul>
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
    country.removeEventListener("click", setNeighbor)
  );
  countries.forEach((country) =>
    country.addEventListener("click", setNeighbor)
  );
};

//get neighbor
const getNeighbor = async (countryCode) => {
  const url = `https://restcountries.com/v3.1/name/${countryCode}`;
  const { data, errorCode, status } = await getData(url);
  if (status) {
    let [country] = data;
    let {
      flags: { svg: flagIcon },
      name: { common: commonName },
      capital: [capital],
      currencies,
      population,
    } = country;
  }
};

//set neighbor
const setNeighbor = (e, obj) => {
  const height = e.currentTarget.lastElementChild.clientHeight;
  e.currentTarget.lastElementChild.classList.toggle('active');
  e.currentTarget.lastElementChild.style.bottom = `-${height+10}px`;
  
  console.log(e.currentTarget);
  // if (e.currentTarget.lastElementChild.classList.contains("neighbors")) return;
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
  getCountry(countryName);
  clearListBtn.style.display = "block";
  e.target.reset();
};

//Main function
const main = () => {};

//Main event listeners
document.addEventListener("DOMContentLoaded", main);
form.addEventListener("submit", handleForm);
clearListBtn.addEventListener("click", clearList);
