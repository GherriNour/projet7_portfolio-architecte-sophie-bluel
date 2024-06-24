
///                   Ajouter Figure dans Gallery                                     //

// Fonction affiche work
function displayWorkFigure(work) {
  const figure = document.createElement('figure');
  const figureCaption = document.createElement('figcaption');
  const figureImage = document.createElement('img');

  figureImage.src = work.imageUrl;
  figureImage.alt = work.title
  figureCaption.innerHTML = work.title;
  figure.setAttribute('data-id', work.id);
  figure.setAttribute('category-id', work.categoryId);

  figure.appendChild(figureImage);
  figure.appendChild(figureCaption);
  return figure;
}
// Fonction pour récupérer les travaux depuis l'API.
async function getWorks() {
  try {
    // Effectue la requête à l'API.
    const response = await fetch("http://localhost:5678/api/works");
    // Vérifie si la réponse est valide.
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    // Convertit la réponse en JSON et la retourne.
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch works:", error.message);
    // Retourne un tableau vide en cas d'échec de la récupération des données.
    return [];
  }
}
// Fonction affichage des Figures 
async function displayFigure() {
  const figureContainer = document.querySelector('.gallery');
  figureContainer.innerHTML = "";
  const works = await getWorks();
  // Boucle sur chaque travail récupéré pour l'afficher dans la modale
  works.forEach((work) => {
    const figure = displayWorkFigure(work);
    figureContainer.appendChild(figure);
  });
}

//           Gestion des Filtres                   //

// Fonction filtreElements pour filtrer les figures par catégorie
function filtreElements(categorieId) {

  const elements = document.querySelectorAll('div.gallery figure');
  elements.forEach((element) => {

    if (categorieId === null || element.getAttribute('category-id') === String(categorieId)) {
      element.style.display = 'block';
    } else {
      element.style.display = 'none';
    }
  });
}

// fonction ajouter boutons dans filtre
async function addButtonFiltre() {
  const button = document.createElement('button');
  button.setAttribute('id', 'btnTous');
  button.setAttribute("class", "filterButton selected ");
  button.textContent = 'Tous';
  const container = document.querySelector('.filtre');
  // Ajout du bouton au conteneur
  container.appendChild(button);

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

//           Gestion des Filtres                   //

// Fonction pour récupérer les catégories depuis l'API.
async function getCategories() {
  const categories = await fetch("http://localhost:5678/api/categories");
  //console.log(categories);
  const categoriesJson = categories.json();
  // console.log(categoriesJson);
  return categoriesJson;
}

// Affiche les categories dans la liste des categories
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

//           Géstion d'affichage Login Logout                   //

//Fonction Utilisateur connecté
function userConnection() {
  // si le token existe dans le sessionStorage 
  if (sessionStorage.getItem("token"));
}


// Fonction géstion affichage Login Logout
function displayLoginLogout() {

  const loginStatus = document.getElementById("login");
  const logoutStatus = document.getElementById("logout");
  const headerEditModify = document.getElementById("headerEditMode");
  const portfolioModify = document.getElementById("portfolio-l-modify");

  //  Mode login : Utilisateur connecté
  if (JSON.parse(sessionStorage.getItem("isConnected"))) {
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
    sessionStorage.removeItem("Token");
    sessionStorage.removeItem("isConnected");
    window.location.replace("index.html");
  });
};

// //           Géstion du Modal                   //

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
  // Bouton Ajout photo
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

// Fonction affiche Modal Photo
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


//Ajouter les figures dans modal

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

// Fonction pour afficher les figures dans la modale.
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

// Fonction deleteWork 
function deleteWork(Id) {

  const confirmation = confirm("Êtes-vous sûr de vouloir supprimer ce projet ?");
  if (confirmation) {
    const token = sessionStorage.getItem("Token");
    fetch(`http://localhost:5678/api/works/${Id}`, {
      method: 'DELETE',
      headers: {
        "Accept": 'application/json',
        "Authorization": `Bearer ${token}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new error('La supression du travai à echoué.');
        }
        const work = document.querySelector(`figure[id="${Id}"]`);
        if (work) {
          work.remove();
          displayFigureModal();
          displayFigure();
        } else {
          console.error('Élément à supprimer non trouvé dans la modale');
        }
      })
      .catch(error => console.error(error));
  }
}

// Fonction Check form filled//
function checkForm() {
  const titleInput = document.getElementById('modal-photo-title');
  const categorySelect = document.getElementById('modal-photo-category');
  const imageInput = document.getElementById('image');
  const submitButton = document.getElementById('modal-valider');
  submitButton.disabled = !(titleInput.value !== '' && categorySelect.value !== '' && imageInput.value !== '');

}

// Fonction géstion des actions dans AddForm
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
// Function add new work
function addNewWork(event) {
  event.preventDefault();
  const token = sessionStorage.getItem("Token");
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

  // Envoyer le nouveau projet au Back-end
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

//Preview image
function previewImage() {


  const inputImage = document.getElementById("image");
  const labelImage = document.getElementById("label-image");
  const pImage = document.querySelector("#form-photo-div > p");
  const iconeImage = document.querySelector("#iModalImage");

  inputImage.addEventListener("change", function () {
    const selectedImage = inputImage.files[0];

    const imgPreview = document.createElement("img");
    imgPreview.src = URL.createObjectURL(selectedImage);
    imgPreview.style.maxHeight = "100%";
    imgPreview.style.width = "auto";

    labelImage.style.display = "none";
    pImage.style.display = "none";
    inputImage.style.display = "none";
    iModalImage.style.display = "none";
    document.getElementById("form-photo-div").appendChild(imgPreview);
  });
}
// Fonction principale qui initialise toutes les autres au chargement de la page
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