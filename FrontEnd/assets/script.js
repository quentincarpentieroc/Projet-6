function recupDonnees () {
 return fetch ("http://localhost:5678/api/works")
    .then(response => response.json())
    .catch((error) => {
        console.error("Erreur lors du chargement des données")
    });
}

//Fonction extracation des catégories de l'API
function recupCategories(data) {
    const categories = ["Tous"];
    data.forEach((item) => {
        const categorie = item.category.name
        if (!categories.includes(categorie)) {
            categories.push(categorie);
        }
    })
    return categories;
}

//Fonction créer boutton de catégorie
function boutonsCategorie(categories) {
    const conteneurCategories = document.getElementById("filtres");

    categories.forEach((categorie) => {
        const button = document.createElement("button");
        button.textContent = categorie;
        button.setAttribute("data-categorie", categorie);
        conteneurCategories.appendChild(button);
    })
}

//Fonction maj de la galerie vis a vis de la catégorie
function majCategorie(data, categorie) {
    const conteneur = document.getElementById("galerie");
    conteneur.innerHTML = "";
 
    data.forEach((item) => {
        if (categorie === "Tous" || item.category.name === categorie) {
            const figure = document.createElement("figure");
            const image = document.createElement("img");
            image.src = item.imageUrl;
            const titre = document.createElement("figcaption");
            titre.textContent = item.title;

            figure.appendChild(image);
            figure.appendChild(titre);

            conteneur.appendChild(figure);
        }
    });
}

//Fonction d'initialisation des boutons de catégorie
function initialiserCategorie(data) {
    const boutonsCategorie = document.querySelectorAll("#filtres button");

    boutonsCategorie.forEach((bouton) => {
        bouton.addEventListener("click", () => {
            const categorie = bouton.getAttribute("data-categorie");
            majCategorie(data, categorie);
        });
    });
}

//Fonction principale
function gallery() {
    recupDonnees()
        .then((data) => {
            const categories = recupCategories(data);
            boutonsCategorie(categories);
            initialiserCategorie(data);
            majCategorie(data, "Tous"); //Affiche toutes les images au début
        });
}

gallery();