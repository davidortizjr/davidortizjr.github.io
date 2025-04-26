const overlay = document.createElement("div");
overlay.classList.add("background-overlay");
document.body.appendChild(overlay);

document.querySelector(".school").addEventListener("mouseover", function () {
    overlay.style.backgroundImage = "url('img/schoolBG.jpg')";
    overlay.style.opacity = "1";
});

document.querySelector(".school").addEventListener("mouseout", function () {
    overlay.style.opacity = "0";
});

document.querySelector(".personal").addEventListener("mouseover", function () {
    overlay.style.backgroundImage = "url('img/personalBG.jpeg')";
    overlay.style.opacity = "1";
});

document.querySelector(".personal").addEventListener("mouseout", function () {
    overlay.style.opacity = "0";
});

document.querySelector(".about").addEventListener("mouseover", function () {
    overlay.style.backgroundImage = "url('img/personalBG.jpeg')";
    overlay.style.opacity = "1";
});

document.querySelector(".about").addEventListener("mouseout", function () {
    overlay.style.opacity = "0";
});