updatePictures("light")

function switchMode() {
    var currentTheme = document.documentElement.getAttribute("data-theme");
    var targetTheme = "light";

    if (currentTheme === "light") {
        targetTheme = "dark";
    }

    document.documentElement.setAttribute('data-theme', targetTheme)
    localStorage.setItem('theme', targetTheme);
    updatePictures(targetTheme)
} 

var storedTheme = localStorage.getItem('theme') || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
if (storedTheme)
    document.documentElement.setAttribute('data-theme', storedTheme)
    updatePictures(storedTheme)


function updatePictures(theme){
    const pictureElements = document.querySelectorAll('picture');
    pictureElements.forEach(pictureElement => {
        const sourceElements = pictureElement.querySelectorAll('source');
        sourceElements.forEach(sourceElement => {
            if (theme === "light") {
                sourceElement.setAttribute('media', 'none');
            } else {
                sourceElement.setAttribute('media', 'all');
            }
        });
      });
}

function initPicture() {
    var initTheme = document.documentElement.getAttribute("data-theme");
    updatePictures(initTheme)
}