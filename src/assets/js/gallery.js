document.addEventListener("DOMContentLoaded", () => {
    const gallerySection = document.querySelector("[data-selected-album]");
    const galleryButtons = document.querySelectorAll("button[data-gallery]");
    const galleryAlbums = document.querySelectorAll("[data-gallery][class*='group/gallery']");

    if (!gallerySection) return;

    document.addEventListener("click", (e) => {
        const button = e.target.closest("button[data-gallery]");
        if (!button) return;

        const selectedKey = button.dataset.gallery;

        // Update parent data attribute
        gallerySection.dataset.selectedAlbum = selectedKey;

        // Update active button
        galleryButtons.forEach((btn) =>
            btn.classList.toggle("font-semibold", btn === button)
        );

        // Toggle visible album with smooth transition
        galleryAlbums.forEach((album) => {
            const isActive = album.dataset.gallery === selectedKey;

            if (isActive) {
                album.classList.add("active");
            } else {
                album.classList.remove("active");
            }
        });
    });
});