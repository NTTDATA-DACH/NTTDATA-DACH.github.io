randomizeTitle = function () {
  var title = document.getElementById('title');
  if (!title) {
    return;
  }
  var titles = title.innerText.split('|').map(e => e.trim());
  title.innerHTML = titles[Math.floor(Math.random() * titles.length)];
}

if (document.readyState === "complete" || document.readyState === "interactive") {
  setTimeout(randomizeTitle, 1);
} else {
  document.addEventListener("DOMContentLoaded", randomizeTitle);
}

function switchMode() {
  var currentTheme = document.documentElement.getAttribute("data-theme");
  var targetTheme = "light";

  if (currentTheme === "light") {
      targetTheme = "dark";
  }

  document.documentElement.setAttribute('data-theme', targetTheme)
  localStorage.setItem('theme', targetTheme);
} 

var storedTheme = localStorage.getItem('theme') || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
if (storedTheme)
    document.documentElement.setAttribute('data-theme', storedTheme)




