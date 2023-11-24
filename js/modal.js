function openModal(imageId) {
    const modal = document.getElementById("uphillModal");
    if (modal === null) {
        return
    }
    // Get the original image element and use it inside the modal
    const img = document.getElementById(imageId);
    const modalImg = document.getElementById("modalImg");
    const captionText = document.getElementById("caption");
    
    // Display modal
    modal.style.display = "block";
    modalImg.src = img.src;
    captionText.innerHTML = img.alt;

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