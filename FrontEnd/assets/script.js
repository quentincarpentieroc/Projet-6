//Récupération du token
const token = sessionStorage.getItem("authToken")

//Récupération des données de l'api (images + Catégories)
function recupDonnees () {
    return fetch ("http://localhost:5678/api/works")
       .then(response => response.json())
       .catch((error) => {
           console.error("Erreur lors du chargement des données")
       });
   }
   
//Fonction extracation des catégories de l'API
function recupCategories(data) {
    const categories = ["Tous"]
    data.forEach((item) => {
        const categorie = item.category.name
        if (!categories.includes(categorie)) {
            categories.push(categorie)
        }
    })
    return categories;
}
   
//Fonction créer boutton de catégorie
function initialiserCategorie(data) {
const boutonsCategorie = document.querySelectorAll("#filtres button");

boutonsCategorie.forEach((bouton) => {
    bouton.addEventListener("click", () => {
        boutonsCategorie.forEach((btn) => {
            btn.classList.remove("active");
        });

        const categorie = bouton.getAttribute("data-categorie");
        majCategorie(data, categorie);

            
        bouton.classList.add("active");
        });
    });
}
   
//Fonction maj de la galerie vis a vis de la catégorie
function majCategorie(data, categorie) {
    const conteneur = document.getElementById("galerie")
    const conteneurAside = document.getElementById("modalPhoto")
   
    conteneur.innerHTML = ""
    
    data.forEach((item) => {
        if (categorie === "Tous" || item.category.name === categorie) {
            const figure = document.createElement("figure")
            figure.classList.add("imgGalerie")
            const image = document.createElement("img")
            image.src = item.imageUrl
            const titre = document.createElement("figcaption")
            titre.textContent = item.title;
   
            figure.appendChild(image)
            figure.appendChild(titre)
   
            conteneur.appendChild(figure)
        }
    });
}

//Fonction créer boutton de catégorie
function boutonsCategorie(categories, data) {
const conteneurCategories = document.getElementById("filtres");
    
categories.forEach((categorie) => {
    const button = document.createElement("button");
    button.textContent = categorie;
    button.setAttribute("data-categorie", categorie);
    button.classList.add("categorie-btn");
    button.style.color = "#1D6154";
    button.style.border = "1px solid #1D6154";
    button.style.fontWeight = "bold";
    button.style.paddingLeft = "17px";
    button.style.paddingRight = "17px";

    button.addEventListener("click", (event) => {
        const buttons = conteneurCategories.querySelectorAll("button.categorie-btn");

        buttons.forEach((btn) => {
            btn.classList.remove("active");
            btn.style.backgroundColor = "";
            btn.style.color = "#1D6154";
        });

        const clickedButton = event.target;
        clickedButton.classList.add("active");
        clickedButton.style.backgroundColor = "#1D6154";
        clickedButton.style.color = "#FFFFFF";

        const categorie = clickedButton.getAttribute("data-categorie");
        majCategorie(data, categorie);
    });

    conteneurCategories.appendChild(button);
    });
}

//Fonction d'initialisation des boutons de catégorie
function initialiserCategorie(data) {
    const boutonsCategorie = document.querySelectorAll("#filtres button")
   
    boutonsCategorie.forEach((bouton) => {
        bouton.addEventListener("click", () => {
            const categorie = bouton.getAttribute("data-categorie")
            majCategorie(data, categorie)
        });
    });
}
   
//Fonction principale
function gallery() {
    recupDonnees()
        .then((data) => {
            const categories = recupCategories(data)
            boutonsCategorie(categories, data)
            initialiserCategorie(data)
            majCategorie(data, "Tous") 
        });
}
   
gallery()

//Accés admnistrateur
document.addEventListener("DOMContentLoaded", function () {
    const authToken = sessionStorage.getItem("authToken")
    const barreEdition = document.getElementById("edit")
    const boutonModification = document.getElementById("modification")
    const boutonsCategorie = document.getElementById("filtres")

    if (authToken) {
        barreEdition.style.display = "block"
        boutonModification.style.display = "block"
        boutonsCategorie.style.display="none"

    } else {
        barreEdition.style.display = "none"
        boutonModification.style.display = "none"
    }
});

// Fonction pour gérer la connexion et la déconnexion
document.addEventListener("DOMContentLoaded", function() {
    const authToken = sessionStorage.getItem("authToken")
    const loginButton = document.querySelector("nav ul li a[href='login.html']")
    
    if (authToken) {
        loginButton.textContent = "logout"

        loginButton.addEventListener("click", () => {
            sessionStorage.removeItem("authToken");
        })
    } else {
        loginButton.textContent = "login"
    }
});


//Affichage des photo dans la modal 
function afficherModalPhoto() {
fetch("http://localhost:5678/api/works")
    .then (response => response.json())
    .then (data => {
        const modalPhoto = document.getElementById("modalPhoto")
        modalPhoto.innerHTML = "";

        data.forEach(image => {
            const imageContainer = document.createElement("div")
            imageContainer.className = "image-container"

            const imageElement = document.createElement ("img")
            imageElement.src = image.imageUrl

            imageElement.style.width = "76.86px"
            imageElement.style.height = "102.57px"

            const iconePoubelle = document.createElement("i")
            iconePoubelle.className = "fa-regular fa-trash-can fa-lg icone-poubelle"
            iconePoubelle.setAttribute("data-id", image.id);

            imageContainer.appendChild(imageElement)
            imageContainer.appendChild(iconePoubelle)

            modalPhoto.appendChild(imageContainer)
        })
    })
    .catch(error => {
        console.error("Erreur lors de la récupération des images", error)
    })
}

//Fonction suppression d'image
async function supprimerImage(workId, authToken) {
        fetch(`http://localhost:5678/api/works/${workId}`, {
            method: "DELETE",
            headers: {
                Authorization : `Bearer ${authToken}`
            }
        })
        .then(response => {
            if (response.status === 204) {
                gallery()
                afficherModalPhoto()
            }
        })
        .catch(error => {
            console.error("Erreur lors de la suppression de l'image", error);
        })
    }

document.addEventListener("click", function(event) {
    if(event.target.classList.contains("icone-poubelle")) {
        const workIdSupprimer = event.target.getAttribute("data-id")
        const authToken = sessionStorage.getItem("authToken");
        supprimerImage(workIdSupprimer, authToken)
    }
})

document.addEventListener("DOMContentLoaded", function () {
    afficherModalPhoto();
});


//Switch entre les 2 modals
const modal = document.getElementById("modal1")
const modal2 = document.getElementById("modal2")
const btnAjout = document.getElementById("btnajout")
const btnRetour = document.getElementById("btnretour")

btnAjout.addEventListener("click", function() {
    modal.classList.add("hidden");
    modal2.classList.remove("hidden");
    modal2.setAttribute("aria-hidden", "false");
});

btnRetour.addEventListener("click", function() {
    modal2.classList.add("hidden");
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
});

    
//Fonction ouverture et fermeture de la modal galerie
document.addEventListener("DOMContentLoaded", function() {

    const boutonModif = document.getElementById("modification")
    const modal = document.getElementById("modal1")
    const boutonFermer = document.getElementById("close")

    boutonModif.addEventListener("click", function() {
        modal.style.display= "block"
    })

    boutonFermer.addEventListener("click", function() {
        modal.style.display="none"
    })

    modal.addEventListener("click", function(event) {
        if (event.target === modal) {
            modal.style.display = "none"
            modal2.style.display = "none"
        }
    })
})

//Fermeture de la modal ajout
document.addEventListener("DOMContentLoaded", function(){
    const modal2 = document.getElementById("modal2")
    const boutonFermer2 = document.getElementById("close2")

    boutonFermer2.addEventListener("click", function() {
        modal2.style.display = "none"
        modal.style.display="none"
    })

    btnAjout.addEventListener("click", function() {
        modal2.style.display = "block"
    })
})

//Fonction ajout photo + prévisualisation dans la modal
const btnAjoutPhoto = document.getElementById("btnAjoutPhoto");
const rectangle = document.querySelector(".rectangle");
const imageContainer = document.getElementById("imageContainer");

btnAjoutPhoto.addEventListener("change", () => {
  document.getElementById("iconeImage").style.display = "none";
  document.querySelector("label[for='btnAjoutPhoto']").style.display = "none";
  document.getElementById("messageRegle").style.display = "none";

  const selectedFile = btnAjoutPhoto.files[0];

if (selectedFile) {
  const newImage = document.createElement("img");
  newImage.src = URL.createObjectURL(selectedFile);
  newImage.style.width = "129px";
  newImage.style.height = "169px";

  imageContainer.appendChild(newImage);
}
});


//Fonction récupération des catégories
document.addEventListener("DOMContentLoaded", function() {
    function modalCategories() {
        fetch("http://localhost:5678/api/categories")
            .then ((response) => response.json())
            .then ((data) => {
                const categorieSelect = document.getElementById("categorie-modal")

                data.forEach((categorie) => {
                    const option = document.createElement("option")
                    option.value = categorie.id
                    option.textContent = categorie.name
                    categorieSelect.appendChild(option)
                })
            })
            .catch ((error) => {
                console.error("Erreur lors de la récupération des catégories : ", error)
            })
    }
    modalCategories()
})

//Fonction changement couleur bouton Valider

const titreModalInput = document.getElementById("name-modal")
const categorieModalSelect = document.getElementById ("categorie-modal")
const modalBoutonValider = document.getElementById("modal-valide")

titreModalInput.addEventListener("input", toggleValiderButtonColor)
categorieModalSelect.addEventListener("input", toggleValiderButtonColor)

function toggleValiderButtonColor() {
    const siTitreOk = titreModalInput.value.trim() !== ""
    const siCategorieOk = categorieModalSelect.value !== ""
    const siImageOk = document.getElementById("imageContainer").hasChildNodes()

        if (siTitreOk && siCategorieOk && siImageOk) {
            modalBoutonValider.style.backgroundColor= "#1D6154"
        } else {
            modalBoutonValider.style.backgroundColor = ""
        }
}

// Fonction pour mettre à jour les boutons de catégorie après l'ajout d'une image
function mettreAJourBoutonsCategorie(data) {
    const categories = recupCategories(data);
    const conteneurCategories = document.getElementById("filtres");

    conteneurCategories.innerHTML = "";

    boutonsCategorie(categories);
    
    initialiserCategorie(data);
}

// Fonction pour envoyer les données à l'API
function envoyerDonnees() {
    const titreModalInput = document.getElementById("name-modal");
    const categorieModalSelect = document.getElementById("categorie-modal");
    const imageFile = document.getElementById("btnAjoutPhoto").files[0];

    if (titreModalInput.value.trim() !== "" && categorieModalSelect.value !== "" && imageFile) {

        const categorieId = categorieModalSelect.value;
        const formData = new FormData();
        formData.append("title", titreModalInput.value);
        formData.append("category", categorieId);
        formData.append("image", imageFile);

        const authToken = sessionStorage.getItem("authToken");

        const requestOptions = {
            method: "POST",
            body: formData,
            headers: {
                Authorization: `Bearer ${authToken}`,
            }
        };

        // Envoyer la requête à l'API
        fetch("http://localhost:5678/api/works", requestOptions)
            .then(response => {
                if (response.status === 201) {
                    response.json().then(data => {

                        const imageUrl = data.imageUrl;
                        const categorieId = data.category;
                        const title = data.title;
                        mettreAJourGalerieAvecNouvelleImage(imageUrl, categorieId, title);

                        const modalPhoto = document.getElementById("modalPhoto")
                        const imageContainer = document.createElement("div");
                        imageContainer.className = "image-container";

                        const imageElement = document.createElement("img");
                        imageElement.src = imageUrl;
                        imageElement.style.width = "76.86px";
                        imageElement.style.height = "102.57px";

                        const iconePoubelle = document.createElement("i");
                        iconePoubelle.className = "fa-regular fa-trash-can fa-lg icone-poubelle";
                        iconePoubelle.setAttribute("data-id", data.id);

                        imageContainer.appendChild(imageElement);
                        imageContainer.appendChild(iconePoubelle);

                        modalPhoto.appendChild(imageContainer);
                    })
                    titreModalInput.value = "";
                    categorieModalSelect.value = "";
                    document.getElementById("btnAjoutPhoto").value = "";
                    imageContainer.innerHTML = "";

                    const modal2 = document.getElementById("modal2");
                    modal2.style.display = "none";
                    modal.style.display = "none";
                } else {
                    console.error("Erreur lors de l'ajout des données à l'API.");
                }
            })
            .catch(error => {
                console.error("Erreur lors de l'envoi de données à l'API : ", error);
            });
    } else {
        console.error("Veuillez remplir tous les champs avant d'envoyer les données.");
    }
}

// Fonction pour rafraîchir la modal2
function rafraichirModal2() {
    document.getElementById("btnAjoutPhoto").value = "";
    document.getElementById("imageContainer").innerHTML = "";
    document.getElementById("iconeImage").style.display = "block";
    document.querySelector("label[for='btnAjoutPhoto']").style.display = "block";
    document.getElementById("messageRegle").style.display = "block";
}


// Ajouter un gestionnaire d'événements pour le bouton Valider dans la modal2
modalBoutonValider.addEventListener("click", function() {
    envoyerDonnees()
    rafraichirModal2()
})

function mettreAJourGalerieAvecNouvelleImage(imageUrl, categorieId, title) {
    const conteneur = document.getElementById("galerie");
    const figure = document.createElement("figure");
    const image = document.createElement("img");
    image.src = imageUrl;
    const titre = document.createElement("figcaption");
    titre.textContent = title;

    figure.appendChild(image);
    figure.appendChild(titre);

    conteneur.appendChild(figure);

    if (categorieId) {
        const categorie = document.querySelector(`#filtres button[data-categorie="${categorieId}"]`);
        if (categorie) {
            majCategorie(data, categorieId);
        }
    }
}