const body = document.querySelector("body"),
  sidebar = body.querySelector("nav"),
  toggle = body.querySelector(".toggle"),
  // searchBtn = body.querySelector(".search-box"),
  modeSwitch = body.querySelector(".toggle-switch"),
  modeText = body.querySelector(".mode-text");
toggle.addEventListener("click", () => {
  sidebar.classList.toggle("close");
});
// searchBtn.addEventListener("click", () => {
//   sidebar.classList.remove("close");
// });
const image = document.getElementById("botImage");
modeSwitch.addEventListener("click", () => {
  body.classList.toggle("dark");
  if (body.classList.contains("dark")) {
    modeText.innerText = "Light mode";
    image.src = "../../../assets/bot2.png";
  } else {
    modeText.innerText = "Dark mode";
    image.src = "../../../assets/bot.png";
  }
});
