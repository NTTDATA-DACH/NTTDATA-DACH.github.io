function openModal(imageId) {
    var theme = document.documentElement.getAttribute("data-theme");
    const modal = document.getElementById("uphillModal");
    if (modal === null) {
        return
    }
    // Get the original image element and use it inside the modal
    const picture = document.getElementById(imageId);
    const img = picture.getElementsByTagName("img")[0];
    const source = picture.getElementsByTagName("source")[0];
    const caption = img.getAttribute("caption");
    const ref = img.getAttribute("ref");

    //modal
    const modalImg = document.getElementById("modalImg");
    const captionText = document.getElementById("caption");
    
    // Display modal
    modal.style.display = "block";
    modalImg.src = img.src;
    if (theme === "dark" && typeof source != 'undefined'){
        modalImg.src = source.srcset;
    }
    if (typeof caption != 'undefined'){
        captionText.innerHTML = caption;

        if (typeof ref != 'undefined' && ref != null){
            captionText.setAttribute("ref", "Figure " + ref + ". ");
        }
    }
    

    // The element that closes the modal
    const close = document.getElementsByClassName("modal-close")[0];
    // When the user clicks on (x) button, close modal.
    close.onclick = function () {
        modal.style.display = "none";
    }
    // When the user hits ESC, close modal as well.
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            modal.style.display = "none";
        }
    })
}