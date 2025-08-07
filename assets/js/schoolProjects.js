const schoolProjects = [
    {
        img: "assets/img/gallery.jpg",
        title: "Gallery",
        link: "https://davidortizjr.github.io/old-portfolio/school/webdev/Gallery/index.html",
        desc: "A gallery of my favorite photos that uses javascript."
    },
    {
        img: "https://img.redbull.com/images/c_limit,w_1500,h_1000/f_auto,q_auto/redbullcom/2020/6/5/ctsejxmdtw9inp8zqqqd/red-bull-campus-clutch-valorant-agents",
        title: "Valorant API",
        link: "https://davidortizjr.github.io/old-portfolio/school/webdev/API/index.html",
        desc: "A valorant info page that uses the valorant API."
    },
    {
        img: "https://www.sonypicturesanimation.com/sites/default/files/styles/max_1300_x_1300/public/2022-12/SV2_uct0287.1058_lm_v1.jpg?itok=qdcFCTgZ",
        title: "SPIDER-MAN: ACROSS THE SPIDER-VERSE",
        link: "https://davidortizjr.github.io/old-portfolio/school/webdev/Parallax/banner.html",
        desc: "A Spiderman themed site using the parallax effect."
    },
    {
        img: "assets/img/liftMNL.jpg",
        title: "Lift MNL",
        link: "https://davidortizjr.github.io/old-portfolio/school/ADET/A03/index.html",
        desc: "A clothing site which uses the bento grid layout."
    },
    {
        img: "https://preview.redd.it/do-you-think-teezo-touchdown-will-get-signed-to-cactus-jack-v0-mf7x3bn3h87d1.jpeg?auto=webp&s=64ecc7460d5a83367b1d0579d8646b9efa67d3fb",
        title: "MVC",
        link: "https://davidortizjr.github.io/old-portfolio/school/ADET/A02/index.php",
        desc: "A site where I utilize the MVC architecture using PHP."
    }
];

// Function to render school projects dynamically
export function renderSchoolProjects(containerId = "maincontent") {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = schoolProjects.map(project => `
        <div class="container-fluid d-flex border-start border-3 border-dark ps-3 mb-5">
            <div class="bg-white">
                <img src="${project.img}" alt="gallery" class="gallery img-fluid">
            </div>
            <div class="px-3">
                <a href="${project.link}" target="_blank">
                    <h4 class="fw-bold">${project.title}</h4>
                </a>
                <p>${project.desc}</p>
            </div>
        </div>
    `).join('');
}

window.renderSchoolProjects