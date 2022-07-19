// Récupération des données des différents canapés du catalogue
function fetchCart () {
    let items = [];
    if (localStorage.getItem("cart") != null) {
        items = JSON.parse(localStorage.getItem("cart"));
    }
    return items;
}
let items = fetchCart();

// Affichage de tous les éléments du panier
async function showCart() {
    let totalQuantity = 0;
    let totalPrice = 0;

    // Boucle permettant d'afficher chacun des éléments
    for (let i of items) {
        let id = i[0];
        let color = i[1];
        let quantity = i[2];
        // On récupère les données spécifiques au canapé ayant l'Id correspondant  
        const promise = await fetch(`http://localhost:3000/api/products/${id}`);
        const product = await promise.json();   
        
        // Intégration des éléments du canapé dans le DOM
        document.getElementById("cart__items")
        .innerHTML += `<article class="cart__item" data-name="${product.name}" data-id="${product._id}" data-color="${color}">
        <div class="cart__item__img">
        <img src="${product.imageUrl}" alt="${product.altTxt}">
        </div>
        <div class="cart__item__content">
        <div class="cart__item__content__description">
            <h2>${product.name}</h2>
            <p>${color}</p>
            <p>${product.price},00 €</p>
        </div>
        <div class="cart__item__content__settings">
            <div class="cart__item__content__settings__quantity">
            <p>Qté : </p>
            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${quantity}">
            </div>
            <div class="cart__item__content__settings__delete">
            <p class="deleteItem">Supprimer</p>
            </div>
        </div>
        </div>
        </article>`;

        // Incrémentation de la quantité totale et du prix total avec les données de l'article renseigné
        totalQuantity += quantity;
        totalPrice += product.price * quantity;
    }

    // Une fois la boucle terminée, on affiche la quantité totale et le prix total
    document.getElementById("totalQuantity")
    .innerText = totalQuantity;
    document.getElementById("totalPrice")
    .innerText = totalPrice + ',00';
}

// Fonction de modification des quantités du panier
function modifyEvents()
{
    // On récupère chaque champ permettant de modifier la quantité et on examine leur comportement
    const modifyItemValues = document.getElementsByClassName('itemQuantity');
    for (let modifyItemValue of modifyItemValues) {
        modifyItemValue.addEventListener('change', function(event) {

            // On interdit de renseigner une quantité inférieure à 1
            if (parseInt(modifyItemValue.value) < 1) {
                alert('Vous ne pouvez pas renseigner une quantité inférieure à 1 !');
                return;
            }

            // On cherche l'article contenant le champ modifié et on récupère les données correspondantes
            let modifiedItem = event.target.closest('article');
            let modifiedId = modifiedItem.dataset.id;
            let modifiedColor = modifiedItem.dataset.color;
            let modifiedName = modifiedItem.dataset.name;

            // On récupère dans le panier le canapé dont l'id et la couleur correspondent, et on lui modifie la quantité
            items.find(function (item) {
                    if ( item[0] == modifiedId && item[1] == modifiedColor ) {
                        item[2] = parseInt(modifyItemValue.value);
                    }
                });
            
            // On réintègre les quantités à jour dans le localstorage, et on recharge la page
            localStorage.setItem("cart", JSON.stringify(items));
            window.location.href = "cart.html";
            alert(`La quantité de ${modifiedName} ${modifiedColor} a été modifiée !`);
        });
    }
}

// Fonction de suppression d'un article du panier
function deleteEvents()
{

    // On récupère chaque bouton supprimer et on examine leur comportement
    const deleteItemButtons = document.getElementsByClassName('deleteItem');
    for (let deleteItemButton of deleteItemButtons) {
        deleteItemButton.addEventListener('click', function(event) {

            // On cherche l'article contenant le bouton supprimer qui a été cliqué
            let deletedItem = event.target.closest('article');
            let deletedId = deletedItem.dataset.id;
            let deletedColor = deletedItem.dataset.color;
            let deletedName = deletedItem.dataset.name;

            // On cherche le canapé correspondant à l'id et la couleur de l'article à supprimer, et on le supprime du panier en filtrant celui-ci
            const searchDeletedItem = items.find(item => item[0] == deletedId && item[1] == deletedColor);
            items = items.filter(item => item != searchDeletedItem);

            // On réintègre le panier sans l'article filtré dans le localstorage, et on recharge la page
            localStorage.setItem("cart", JSON.stringify(items));
            window.location.href = "cart.html";
            alert(`${deletedName} ${deletedColor} retiré du panier !`);
        });
    }
}

// Fonction asynchrone pour attendre que le panier est chargé avant de récupérer les éléments relatifs à la modification et suppression des données du panier
async function loadCart()
{
    await showCart();
    modifyEvents();
    deleteEvents();
}

loadCart();

// On récupère les éléments des champs du formulaire
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const address = document.getElementById('address');
const city = document.getElementById('city');
const email = document.getElementById('email');

// Une regex pour le nom, prénom, et nom de ville ; une autre pour l'adresse mail (aucune pour l'adresse postale, de par la possible complexité naturelle de celles-ci)
const regexNames = /[A-Za-zÀ-Ùà-ù '-.,]{1,31}$|^$/i;
const regexMail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// On teste chaque champ avec la regex correspondante. Si le champ renseigné est conforme, on supprime l'éventuel message d'erreur présent.
function validateFirstName(firstName) {
    if (regexNames.test(firstName)) {
        document.getElementById('firstNameErrorMsg').innerText = null;
        return true;
    } else {
        return false;
    }
}
function validateLastName(lastName) {
    if (regexNames.test(lastName)) {
        document.getElementById('lastNameErrorMsg').innerText = null;
        return true;
    } else {
        return false;
    }
}
function validateCity(city) {
    if (regexNames.test(city)) {
        document.getElementById('cityErrorMsg').innerText = null;
        return true;
    } else {
        return false;
    }
}
function validateMail(email) {
    if (regexMail.test(email)) {
        document.getElementById('emailErrorMsg').innerText = null;
        return true;
    } else {
        return false;
    }
}

// On prépare la commande json avec un objet contact contenant les champs du formulaire et un objet products contenant les id des articles commandés.
function makeJsonOrder() {
    let contact = {
        firstName: firstName.value,
        lastName: lastName.value,
        address: address.value,
        city: city.value,
        email: email.value,
    };
    let items = fetchCart();
    let products = [];

    for (i = 0; i < items.length; i++) {
        products.push(items[i][0]);
    }

    // On convertit ces éléments au format json
    let jsonData = JSON.stringify({ contact, products});
    return jsonData;
}

// On récupère le bouton de commande et on observe son comportement au clic
const orderButton = document.getElementById('order');
orderButton.addEventListener('click', function (event) {
        event.preventDefault();

        // On récupère les données de chaque champ
        let orderFirstName = validateFirstName(firstName.value);
        let orderLastName = validateLastName(lastName.value);
        let orderCity = validateCity(city.value);
        let orderMail = validateMail(email.value);
        let orderAddress = address.value;

        // Si une seule des données est fausse, on affiche le message d'erreur correspondant et on interrompt la commande
        if ( orderFirstName == false || orderLastName == false || orderCity == false || orderMail == false || orderAddress == null ) {
            if (orderFirstName == false) {
                firstNameErrorMsg.innerText = "Entrez un prénom valide.";
            }
            if (orderLastName == false) {
                lastNameErrorMsg.innerText = "Entrez un nom valide.";
            }
            if (orderCity == false) {
                cityErrorMsg.innerText = "Entrez un nom de ville valide.";
            }
            if (orderMail == false) {
                emailErrorMsg.innerText = "Entrez une adresse mail valide (au format exemple@kanap.com)."
            }
            if (orderAddress == null) {
                addressErrorMsg.innerText = "Entrez une adresse postale."
            } else {
                addressErrorMsg.innerText = null;
            }
            return;
        }

        // Si la quantité d'articles est égale à 0, le panier est vide, on interrompt donc la commande
        let totalQuantity = document.getElementById("totalQuantity").innerText;
        if (totalQuantity == 0) {
            alert('Vous devez ajouter des articles dans le panier avant de passer commande !');
            return;
        }

        // Requête POST pour envoyer les infos de contact et les données du panier à l'API
        let jsonOrder = makeJsonOrder();
        fetch('http://localhost:3000/api/products/order/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: jsonOrder,
        })

        // On récupère les résultats et on redirige vers la page de confirmation avec l'identifiant de commande retourné par le serveur.
        .then((res) => res.json())
        .then((data) => {
            localStorage.clear();
            window.location.href = `confirmation.html?id=${data.orderId}`;
        })
        .catch(() => {
            alert('Une erreur est survenue, veuillez réessayer plus tard.');
        })
    })