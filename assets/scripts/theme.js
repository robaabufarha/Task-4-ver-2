import { saveToLocalStorage } from "./localstorage.js";
let isDarkMode = localStorage.getItem("isDarkMode");

export const toggleDarkMode = () => {
  isDarkMode = !isDarkMode;
  saveToLocalStorage("isDarkMode", isDarkMode);
  if (isDarkMode) {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }
};

export const theme = () => {
  let mode = localStorage.getItem("isDarkMode");
  if (mode === "true") {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }
};
