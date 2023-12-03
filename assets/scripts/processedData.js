import { getFromLocalStorage } from "./localstorage.js";

export const filterCountriesBySelect = (allData, region) => {
  let filteredData = [];
  if (region.toLowerCase() === "favourits") {
    const storedCountriesNames = getFromLocalStorage("storedCountries") || [];
    console.log(storedCountriesNames);
    filteredData = allData.filter((country) => {
      const favariatCountry = country.name.common.toLowerCase();
      return storedCountriesNames.some((storedCountry) => {
        return favariatCountry === storedCountry.toLowerCase();
      });
    });
  } else {
    filteredData = allData.filter((country) => {
      const countryRegion = country.region.toLowerCase();
      return countryRegion === region.toLowerCase() || region === "noValue";
    });
  }
  return filteredData;
};
