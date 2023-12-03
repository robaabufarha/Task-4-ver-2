import { fetchData, fetchSearchesData } from "../../../assets/scripts/api.js";
import { toggleDarkMode, theme } from "../../../assets/scripts/theme.js";
import { debounce } from "../../../assets/scripts/debounce.js";
import { filterCountriesBySelect } from "../../../assets/scripts/processedData.js";
import {
  saveToLocalStorage,
  getFromLocalStorage,
  addCountryToStorage,
  removeCountryFromStorage,
} from "../../../assets/scripts/localstorage.js";

let allData = await fetchData();
const container = document.getElementById("country-info");
const progressIndicator = document.getElementById("progress-indicator");
const div1 = document.getElementById("sub-favourit-div");
const displayData = async (container, data) => {
  container.innerHTML = "";

  for (let i = 0; i < data.length; i++) {
    const country = data[i];
    const countryDiv = createCountryDiv(country);
    container.appendChild(countryDiv);
  }

  addDragAndDropListeners(div1);
  progressIndicator.style.display = "none";
};

const createCountryDiv = (country) => {
  const countryDiv = document.createElement("div");
  countryDiv.classList.add("col", "col-12");
  countryDiv.id = country.name.common;

  const cardDiv = document.createElement("div");
  cardDiv.classList.add("card");

  const linkElement = document.createElement("a");
  linkElement.href = "../DetailsPage/Details.html";
  linkElement.target = "_blank";

  const imgElement = document.createElement("img");
  imgElement.src = country.flags.svg;
  imgElement.classList.add("card-img-top");
  imgElement.alt = country.flags.alt;

  imgElement.addEventListener("click", () => {
    saveToLocalStorage("selectedCountry", country.name.common);
  });

  linkElement.appendChild(imgElement);

  const cardBodyDiv = document.createElement("div");
  cardBodyDiv.classList.add("card-body");

  const headingElement = document.createElement("h4");
  headingElement.classList.add("card-title", "text-truncate");
  headingElement.textContent = country.name.common;

  const cardTextDiv = document.createElement("div");
  cardTextDiv.classList.add("card-text");

  const populationElement = document.createElement("div");
  populationElement.classList.add("text-truncate");
  populationElement.innerHTML = `<b>Population:</b> ${country.population}`;

  const regionElement = document.createElement("div");
  regionElement.classList.add("text-truncate");
  regionElement.innerHTML = `<b>Region:</b> ${country.region}`;

  const capitalElement = document.createElement("div");
  capitalElement.classList.add("text-truncate");
  capitalElement.innerHTML = `<b>Capital:</b> ${country.capital}`;

  cardTextDiv.appendChild(populationElement);
  cardTextDiv.appendChild(regionElement);
  cardTextDiv.appendChild(capitalElement);

  cardBodyDiv.appendChild(headingElement);
  cardBodyDiv.appendChild(cardTextDiv);
  const starButton = createStarButton(country.name.common);
  cardBodyDiv.appendChild(starButton);

  cardDiv.setAttribute("draggable", true);
  cardDiv.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text", country.name.common);
  });

  cardDiv.appendChild(linkElement);
  cardDiv.appendChild(cardBodyDiv);

  countryDiv.appendChild(cardDiv);

  return countryDiv;
};

const createStarButton = (countryName) => {
  const starButton = document.createElement("button");
  starButton.innerHTML = "&#9733;";
  starButton.classList.add("star-button");

  const storedCountries = getFromLocalStorage("storedCountries") || [];
  if (storedCountries.includes(countryName)) {
    starButton.classList.add("yellow-star");
  }
  starButton.addEventListener("click", () => {
    if (starButton.classList.contains("yellow-star")) {
      starButton.classList.remove("yellow-star");
      removeCountryFromStorage(countryName);
    } else {
      starButton.classList.add("yellow-star");
      addCountryToStorage(countryName);
    }
  });

  return starButton;
};

const addDragAndDropListeners = (div) => {
  div.addEventListener("dragover", (e) => {
    e.preventDefault();
    div.style.border = "2px solid #27ae60";
  });

  div.addEventListener("dragleave", () => {
    div.style.border = "2px solid transparent";
  });

  div.addEventListener("drop", (e) => {
    e.preventDefault();
    const countryName = e.dataTransfer.getData("text");
    const country = allData.find(
      (country) => country.name.common === countryName
    );
    if (country) {
      handleDrop(div, country);
    }
    div.style.border = "2px solid transparent";
  });
};

const handleDrop = (div, country) => {
  const countryName = country.name.common;
  const clonedContentContainer = createClonedContent(country);

  const storedCountries = getFromLocalStorage("storedCountries") || [];
  if (!storedCountries.includes(countryName)) {
    div.appendChild(clonedContentContainer);
  }

  addCountryToStorage(countryName);
};

const handleDelete = (clonedContentContainer) => {
  const countryName = clonedContentContainer.querySelector("span").textContent;
  removeCountryFromStorage(countryName);
  clonedContentContainer.remove();
};

const createClonedContent = (country) => {
  const clonedContentContainer = document.createElement("div");

  clonedContentContainer.classList.add("favourit-div");

  const flagSrc = country.flags.svg;

  const countrySpan = document.createElement("span");
  countrySpan.textContent = country.name.common;
  countrySpan.classList.add("cloned-content-container", "text-truncate");

  const deleteButton = createDeleteButton(
    clonedContentContainer,
    country.name.common
  );

  const flagImage = document.createElement("img");
  flagImage.src = flagSrc;
  flagImage.alt = "Flag";
  flagImage.classList.add("flag-image");

  clonedContentContainer.appendChild(flagImage);
  clonedContentContainer.appendChild(countrySpan);
  clonedContentContainer.appendChild(deleteButton);

  return clonedContentContainer;
};

const createDeleteButton = (clonedContentContainer) => {
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "x";
  deleteButton.classList.add("delete-button", "ms-auto");
  deleteButton.addEventListener("click", () => {
    handleDelete(
      clonedContentContainer,
      getFromLocalStorage("storedCountries") || []
    );
  });

  return deleteButton;
};

document.getElementById("search-input").addEventListener("keyup", (event) => {
  const searchTerm = event.target.value;
  const debouncedSearch = debounce(searchForCountry, 500);
  debouncedSearch(searchTerm);
});

const searchForCountry = async (countryName) => {
  let data1;
  if (countryName === "") {
    data1 = allData;
  } else {
    data1 = await fetchSearchesData(countryName);
  }
  displayData(container, data1);
};

document.getElementById("region-filter").addEventListener("change", () => {
  const selectedRegion = document.getElementById("region-filter").value;
  displayData(container, filterCountriesBySelect(allData, selectedRegion));
});

document.getElementById("dark-theme").addEventListener("click", () => {
  toggleDarkMode();
});
const getCountryData = (countryName, allData) => {
  return allData.find((country) => country.name.common === countryName);
};
const displayStoredCountries = (container, storedCountries) => {
  storedCountries.forEach((countryName) => {
    const countryData = getCountryData(countryName, allData);

    const clonedContentContainer = createClonedContent(countryData);
    container.appendChild(clonedContentContainer);
  });
};

const init = async () => {
  theme();
  displayData(container, allData);

  const storedCountries = getFromLocalStorage("storedCountries");
  if (storedCountries) {
    displayStoredCountries(div1, storedCountries);
  }
};

init();
