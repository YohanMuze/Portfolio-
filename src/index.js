const body = document.body;
const modal = document.querySelector("#modal-article");

/********* Gallery display functions : **********/
function clearGallery(selector) {
    document.querySelector(selector)
        .innerHTML = ``;
}

function removeAllClass(balise, nameClass) {
    for (let i = 0; i < balise.length; i++) {
        balise[i].classList.remove(nameClass);
    }
}

function resetClick(filterId) {
    clearGallery(".gallery");
    removeAllClass(filters, "filter--active");
    filters[filterId].classList.add("filter--active");
}

function filterByCat(arr, id) {
    var result = arr.filter(function (article) {
        return article.categoryId === id;
    });
    return result;
}

function filterById(arr, check) {
    var result = arr.filter(function (article) {
        return article.id === check;
    });
    return result;
}


function fillGallery(arr) {
    for (let i = 0; i < arr.length; i++) {
        document.querySelector(".gallery_box")
            .innerHTML += `    
                <figure class="gallery_card">
                    <a class="modal-link" href="#modal-article">
                        <img id="${arr[i].id}" src="${arr[i].cover}" alt="${arr[i].title}">
                        <figcaption>${arr[i].title}</figcaption>
                    </a>
                </figure>`;
    }
    let modalLink = document.querySelectorAll(".modal-link");
    modalLink.forEach(a => {
        a.addEventListener("click", (e) => {
            openModal(e);
        })
    });
}


function displayGallery() {
    document.querySelector(".gallery_box").innerHTML = "";
    fetch("./public/datas/projets.json")
        .then(data => data.json())
        .then(gallery => {
            galleryFull = gallery;
            galleryActual = galleryFull
            fillGallery(gallery);
        });
    }

function addLink(datas, location) {
    if(datas[0].website) {
        document.querySelector(location)
        .innerHTML += `<a href="${datas[0].website}" target="_blank" aria-describeby="liens vers le site ${datas[0].title}">Lien vers le site</a>`
    }
    else return;
}



    /********* Modal's functions *********/

function openModal(e) {
    e.preventDefault();
    modal.showModal();
    modal.style.display = "flex";
    let target = e.target.id;
    let article = filterById(galleryActual, target);
    body.style.overflowY = "hidden";
    fillModal(article, target);
}

function closeModal() {
    modal.close();
    modal.style.display = "none";
    body.style.overflowY = "auto"
}

function fillModal(article) {
    document.querySelector(".modal-wrapper")
        .innerHTML = 
    `
    <div class="modal-wrapper_layout">    
        <div class="modal-wrapper_left">
            <figure class="modal-wrapper_fig">
                <img class="modal-wrapper_fig_img" src="${article[0].cover}">
                <figcaption class="modal-wrapper_fig_caption">Capture d'écran du site ${article[0].title}</figcaption>
            </figure>
        </div>
        <div class="modal-wrapper_right">
            <div class="modal-wrapper_header">
                <img tabindex="0" class="modal-wrapper_header_icon" src="./public/close_cross.png">
            </div>
            <div class="modal-wrapper_info">
                <h2 class="modal-wrapper_info_h">${article[0].title}</h2>
                <div class="modal-wrapper_info_content">
                    <div class="modal-wrapper_info_mission">
                        <h3 class="modal-wrapper_info_mission_title">Mission</h3>
                        <p>${article[0].mission}</p>
                    </div>
                    <div class="modal-wrapper_info_details">
                        <h3 class="modal-wrapper_info_details_title">Technologies</h3>    
                        <div class="modal-wrapper_info_tags"></div>
                    </div>
                </div>
            </div>
            <div class="modal-wrapper_links">
                <a href="${article[0].github}" target="_blank"> Lien github </a>
                
            </div>
        </div>
    </div>
    `;
    
    let tags = article[0].tags;
    for (let i = 0; i < tags.length; i++) {
        let string = tags[i].replace(new RegExp("[^(a-zA-Z)]", "g"), '');
        let name = string.replace("public", '').replace("png", '');
        document.querySelector(".modal-wrapper_info_tags")
            .innerHTML += 
            `    
                <img src="${tags[i]}" alt="${name}">    
            `;
    };

    addLink(article, ".modal-wrapper_links");
    
    document.querySelector(".modal-wrapper_header_icon")
    .addEventListener("click", (closeModal));
    document.querySelector(".modal-wrapper_header_icon")
    .addEventListener("keyup", (e) => {
        if (e.key === "Enter") {
            closeModal();
        }
    });
}

displayGallery();