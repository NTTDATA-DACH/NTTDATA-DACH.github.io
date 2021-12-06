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
