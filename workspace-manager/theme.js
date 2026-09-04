const themeSelect = document.getElementById("theme-select");
const savedTheme = localStorage.getItem("theme") || "default";

document.body.className = savedTheme;
themeSelect.value = savedTheme;

themeSelect.addEventListener("change", () => {
  document.body.className = themeSelect.value;
  localStorage.setItem("theme", themeSelect.value);
});
