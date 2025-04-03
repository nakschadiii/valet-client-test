const images = [
    { src: "bg-img1.webp" },
    { src: "bg-img3.jpg" },
    { src: "bg-img2.jpg" },
    { src: "bg-img4.jpg" },
    { src: "bg-img5.jpg" },
];

function createSlideshowContainer() {
    let container = document.getElementById("slideshow-container");
    
    // Vérifie si le container existe déjà, sinon le crée
    if (!container) {
        container = document.createElement("div");
        container.id = "slideshow-container";
        container.classList.add("slideshow-container");
        document.body.appendChild(container); // Ajoute à la fin du body
    }
    
    return container;
}

function createSlides() {
    const container = createSlideshowContainer();
    images.forEach((img, index) => {
        const slide = document.createElement("div");
        slide.classList.add("mySlides", "fade");
        slide.innerHTML = `
            <img src="img/${img.src}" style="width:100%; height: 100%; object-fit: cover">
        `;
        container.appendChild(slide);
    });
}

let slideIndex = 0;

function showSlides() {
    let slides = document.getElementsByClassName("mySlides");
    for (let slide of slides) {
        slide.style.display = "none";
    }
    slideIndex = (slideIndex + 1) % images.length;
    slides[slideIndex].style.display = "block";
    setTimeout(showSlides, 4000);
}

createSlides();
showSlides();