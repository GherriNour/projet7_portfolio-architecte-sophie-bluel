// ****************************************** Gestion des filtres   ******************************************

// ********************** fonction ajouter boutons dans filtre
async function addButtonFiltre() {
  // ajout du bouton Tous
  const button = document.createElement('button');
  button.setAttribute('id', 'btnTous');
  button.setAttribute("class", "filterButton selected ");
  button.textContent = 'Tous';
  const container = document.querySelector('.filtre');
  // Ajout du bouton au conteneur
  container.appendChild(button);
  // Ajout des boutons par catégories
  const categories = await getCategories();
  if (categories) {
    categories.forEach(category => {
      // Création dynamique des boutons de catégorie
      const button = document.createElement('button');
      button.setAttribute('id', 'btn' + category.id);
      button.setAttribute("class", "filterButton");
      button.textContent = category.name;

      // Ajout du bouton au conteneur
      container.appendChild(button);

      // gérer l'évènement de clic les boutons des catégories  
      button.addEventListener('click', () => {
        removeSelectButton();
        const btnElement = document.getElementById('btn' + category.id);
        btnElement.classList.add("selected"); // Ajoute la classe 'selected' à l'élément cliqué
        filtreElements(category.id);
      });
    });
  };
  // gérer l'évènement de clic du bouto Tous
  document.getElementById('btnTous').addEventListener('click', () => {
    removeSelectButton();
    const btnTous = document.getElementById('btnTous');
    btnTous.classList.add("selected"); // Ajoute la classe 'selected' à l'élément cliqué
    filtreElements(null)

  });
}
//Fonction Supprime la classe 'selected' de tous les éléments 
function removeSelectButton() {
  document.querySelectorAll(".filterButton").forEach((item) => item.classList.remove("selected"));
}

// Fonction filtreElements pour filtrer les figures par catégorie
function filtreElements(categorieId) {
  // Sélectionner tous les éléments figure dans la div de la galerie
  const elements = document.querySelectorAll('div.gallery figure');

  // Parcourir chaque élément figure
  elements.forEach((element) => {
    // Vérifier si l'ID de la catégorie est nul ou correspond à l'attribut category-id de l'élément
    if (categorieId === null || element.getAttribute('category-id') === String(categorieId)) {
      element.style.display = 'block'; // Afficher l'élément
    } else {
      element.style.display = 'none'; // Masquer l'élément
    }
  });
}
// *****************************    Fonction pour récupérer les catégories depuis l'API.
async function getCategories() {
  const categories = await fetch("http://localhost:5678/api/categories");
  const categoriesJson = await categories.json();
  return categoriesJson;
}
///   *****************************   Ajouter Figure dans Gallery         ************************************

// Fonction affichage des Figures 
async function displayFigure() {
  // Sélectionne le conteneur de la galerie
  const figureContainer = document.querySelector('.gallery');
  // Vide le conteneur de la galerie
  figureContainer.innerHTML = "";
  // Récupère les travaux depuis l'API
  const works = await getWorks();
  // Boucle sur chaque travail récupéré pour l'afficher dans la galerie
  works.forEach((work) => {
    // Crée une figure pour chaque travail
    const figure = displayWorkFigure(work);
    // Ajoute la figure au conteneur de la galerie
    figureContainer.appendChild(figure);
  });
}


// Fonction affiche work
function displayWorkFigure(work) {
  // Création des éléments figure, figcaption et img
  const figure = document.createElement('figure');
  const figureCaption = document.createElement('figcaption');
  const figureImage = document.createElement('img');

  // Configuration des propriétés de l'image
  figureImage.src = work.imageUrl;
  figureImage.alt = work.title;

  // Configuration du texte de la légende
  figureCaption.innerHTML = work.title;

  // Ajout des attributs data-id et category-id au figure
  figure.setAttribute('data-id', work.id);
  figure.setAttribute('category-id', work.categoryId);

  // Ajout de l'image et de la légende à la figure
  figure.appendChild(figureImage);
  figure.appendChild(figureCaption);

  // Retourne l'élément figure complet
  return figure;
}

// Fonction pour récupérer les travaux depuis l'API.
async function getWorks() {
  try {
    // Effectue la requête à l'API
    const response = await fetch("http://localhost:5678/api/works");

    // Vérifie si la réponse est valide
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Convertit la réponse en JSON et la retourne
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch works:", error.message);
    // Retourne un tableau vide en cas d'échec de la récupération des données
    return [];
  }
}




//  *****************************   Affiche les categories dans la liste des categories
async function displayCategories() {
  const selectCategory = document.getElementById('modal-photo-category');
  const categories = await getCategories();
  if (categories) {
    categories.forEach(category => {
      const categoryOption = document.createElement('option');
      const categoryLabel = document.createElement('label');

      categoryOption.setAttribute('value', category.id);
      categoryLabel.innerHTML = category.name;

      selectCategory.appendChild(categoryOption);
      categoryOption.appendChild(categoryLabel);
    });
  }
}

//   ***************************   Géstion d'affichage Login Logout                   //

//Fonction Utilisateur connecté
function userConnection() {
  // si le token existe dans le localStorage 
  if (localStorage.getItem("token"));
}

// Fonction géstion affichage Login Logout
function displayLoginLogout() {

  const loginStatus = document.getElementById("login");
  const logoutStatus = document.getElementById("logout");
  const headerEditModify = document.getElementById("headerEditMode");
  const portfolioModify = document.getElementById("portfolio-l-modify");

  //  Mode login : Utilisateur connecté
  if (JSON.parse(localStorage.getItem("isConnected"))) {
    loginStatus.style.display = 'none';
    logoutStatus.style.display = 'block';
    portfolioModify.style.display = 'flex';
    portfolioModify.style.display = 'flex';
  } else {
    loginStatus.style.display = 'block';
    logoutStatus.style.display = 'none';
    headerEditModify.style.display = 'none';
    portfolioModify.style.display = 'none';
  }

  //  Mode logout : Utilisateur déconnecté
  logoutStatus.addEventListener("click", (event) => {
    event.preventDefault();
    localStorage.removeItem("Token");
    localStorage.removeItem("isConnected");
    window.location.replace("index.html");
  });
};

// *******************************     Géstion du Modal    ***************************************

//  Géstion des actions du Modal  
function setupModalAction() {

  // // ouvrir modal
  const modalTrigger = document.getElementById('modal-trigger');
  if (modalTrigger) {
    modalTrigger.addEventListener('click', function (e) {
      e.preventDefault(); // Prevent the default action of the link
      showModal();
    });
  }
  // *************************     Bouton Ajout photo
  const newPhotoBtn = document.querySelector('#new-photo');
  if (newPhotoBtn) {
    newPhotoBtn.addEventListener('click', displayModalPhoto);
  }
  // Bouton Retour
  const returnBtn = document.querySelector('#modal-return');
  if (returnBtn) {
    returnBtn.addEventListener('click', hideModalPhoto);
  }
  // Bouton X du modal photo
  const modalPhotoClose = document.querySelector("#modal-photo-close");
  if (modalPhotoClose) {
    modalPhotoClose.addEventListener('click', hideModal);
  }
  //  Bouton X du modal 
  const modalClose = document.querySelector('#modal-close');
  if (modalClose) {
    modalClose.addEventListener('click', hideModal);
  }
  document.getElementById('modal-valider').disabled = true;
  displayCategories();
};
// function showModal
function showModal() {
  const modal = document.querySelector('#modal');
  displayFigureModal();
  modal.style.display = 'block';
}

// function hideModal
function hideModal() {
  const modal = document.querySelector('#modal');
  modal.style.display = 'none';
}

// ************************************     Fonction affiche Modal Photo
function displayModalPhoto() {
  const modalContent = document.querySelector('#modal-content');
  const modalPhoto = document.querySelector('#modal-photo');
  modalContent.style.display = 'none';
  modalPhoto.style.display = 'block';
};
// Fonction cache Modal Photo
function hideModalPhoto() {
  const modalContent = document.querySelector('#modal-content');
  const modalPhoto = document.querySelector('#modal-photo');
  modalContent.style.display = 'flex';
  modalPhoto.style.display = 'none';
};


// *****************************    Ajouter les figures dans modal

// Fonction affiche work Modal
function displayWorkFigureModal(work) {
  const figureElement = document.createElement('figure')
  // Ajouter un id= work ID pour chaque figure
  figureElement.setAttribute('id', work.id);
  const figureImage = document.createElement('img')
  figureImage.src = work.imageUrl
  figureImage.alt = work.title
  const deleteIcon = document.createElement('i')
  deleteIcon.className = "fa-regular fa-trash-can"

  figureElement.appendChild(figureImage)
  figureElement.appendChild(deleteIcon)

  //  Supprimer Projet si click sur l'icon delete
  deleteIcon.addEventListener('click', (event) => {
    event.preventDefault();
    deleteWork(work.id);
  });
  return figureElement;
};

// **********************************        Fonction pour afficher les figures dans la modale.
async function displayFigureModal() {
  const imagesModalContainer = document.querySelector('.gallery-modal');
  imagesModalContainer.innerHTML = "";
  const works = await getWorks();
  // Boucle sur chaque travail récupéré pour l'afficher dans la modale
  works.forEach((work) => {
    const figure = displayWorkFigureModal(work);
    imagesModalContainer.appendChild(figure);
  });
}

// **********************************            Fonction deleteWork
function deleteWork(Id) {
  // Demande de confirmation à l'utilisateur
  const confirmation = confirm("Êtes-vous sûr de vouloir supprimer ce projet ?");
  if (confirmation) {
    // Récupération du token depuis le localStorage
    const token = localStorage.getItem("Token");

    // Envoi de la requête DELETE à l'API
    fetch(`http://localhost:5678/api/works/${Id}`, {
      method: 'DELETE',
      headers: {
        "Accept": 'application/json',
        "Authorization": `Bearer ${token}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('La suppression du travail a échoué.');
        }

        // Recherche et suppression de l'élément du DOM
        const work = document.querySelector(`figure[data-id="${Id}"]`);
        if (work) {
          work.remove();
          // Appels à l'affichage des figures pour réaffiche les figures dans la galerie après la suppression.
          displayFigureModal();
          displayFigure();
        } else {
          console.error('Élément à supprimer non trouvé dans la modale');
        }
      })
      .catch(error => console.error('Erreur:', error));
  }
}

//  *******************************       Fonction Check form filled 
function checkForm() {
  const titleInput = document.getElementById('modal-photo-title');
  const categorySelect = document.getElementById('modal-photo-category');
  const imageInput = document.getElementById('image');
  const submitButton = document.getElementById('modal-valider');
  submitButton.disabled = !(titleInput.value !== '' && categorySelect.value !== '' && imageInput.value !== '');

}

// *****************************       Fonction géstion des actions dans AddForm
function listennerAddForm() {
  const titleInput = document.getElementById('modal-photo-title');
  const categorySelect = document.getElementById('modal-photo-category');
  const imageInput = document.getElementById('image');

  titleInput.addEventListener('input', checkForm);
  categorySelect.addEventListener('change', checkForm);
  imageInput.addEventListener('change', checkForm);

  const btnValider = document.getElementById("modal-valider");
  btnValider.addEventListener("click", addNewWork);
}
// **************************           Function add new work
function addNewWork(event) {
  event.preventDefault();
  const token = localStorage.getItem("Token");
  const modalContent = document.querySelector('#modal-content');
  const modalPhoto = document.querySelector('#modal-photo');
  const title = document.getElementById("modal-photo-title").value;
  const category = document.getElementById("modal-photo-category").value;
  const image = document.getElementById("image").files[0];
  if (!title || !category || !image) {
    alert('Tous les champs du formulaire sont obligatoires.')
    return;
  }
  //check if the image does not exceed 4mo//
  if (image.size > 4 * 1024 * 1024) {
    alert("La taille de l'image ne doit pas dépasser 4 Mo.");
    return;
  }
  // ***************************         Envoyer le nouveau projet dans la requete
  const formData = new FormData();
  formData.append("title", title);
  formData.append("category", category);
  formData.append("image", image);
  fetch("http://localhost:5678/api/works", {
    method: "POST",
    body: formData,
    headers: {
      "Accept": 'application/json',
      "Authorization": `Bearer ${token}`
    }
  })
    .then(response => response.json())
    .then(work => {
      //create and add the new work to the gallery//
      const figure = displayWorkFigure(work);
      const gallery = document.querySelector('.gallery');
      gallery.appendChild(figure);

      //create and add the new work to the modal gallery//
      const figureModal = displayWorkFigureModal(work);
      const galleryModal = document.querySelector('.gallery-modal');
      galleryModal.appendChild(figureModal);

      alert('Le nouveau projet a été ajouté avec succès.');
      modalContent.style.display = 'flex';
      modalPhoto.style.display = 'none';
    })
    .catch(error => console.error(error));
};


// *****************************       Fonction affiche la prévisualisation de l'image
function previewImage() {
  const inputImage = document.getElementById("image");
  const labelImage = document.getElementById("label-image");
  const pImage = document.querySelector("#form-photo-div > p");
  const iconeImage = document.querySelector("#iModalImage");

  inputImage.addEventListener("change", function () {
    const selectedImage = inputImage.files[0];

    // Vérifiez si un fichier a bien été sélectionné
    if (!selectedImage) {
      return;
    }

    // Supprimez l'ancienne prévisualisation si elle existe
    const oldPreview = document.querySelector("#form-photo-div img");
    if (oldPreview) {
      oldPreview.remove();
    }

    // Créez et affichez la nouvelle prévisualisation de l'image
    const imgPreview = document.createElement("img");
    imgPreview.src = URL.createObjectURL(selectedImage);
    imgPreview.style.maxHeight = "100%";
    imgPreview.style.width = "auto";

    // Cachez les autres éléments
    if (labelImage) labelImage.style.display = "none";
    if (pImage) pImage.style.display = "none";
    if (inputImage) inputImage.style.display = "none";
    if (iconeImage) iconeImage.style.display = "none";

    document.getElementById("form-photo-div").appendChild(imgPreview);
  });
}

// Appelez la fonction pour s'assurer qu'elle est initialisée
//previewImage();

// *************************       Fonction principale qui initialise toutes les autres au chargement de la page
(function main() {

  // Géstion affichage Login Logout
  displayLoginLogout();

  // Ajout des boutons filtre
  addButtonFiltre();

  // Affichage figures
  displayFigure();
  //  Géstion des actions du Modal  
  setupModalAction();

  // Géstion des actions dans AddForm
  listennerAddForm();
  //Preview image
  previewImage();

})();