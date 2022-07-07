// const { mainModule } = require("process");

// Récupération des données des différents canapés du catalogue
function fetchCart () {
    let items = [];
    if (localStorage.getItem("cart") != null) {
        items = JSON.parse(localStorage.getItem("cart"));
    }
    console.log(items);
    return items;
}
let items = fetchCart();

async function showCart() {
    let totalQuantity = 0;
    let totalPrice = 0;

    for (let i = 0; i < items.length; i++) {
        let id = items[i][0];
        let color = items[i][1];
        let quantity = items[i][2];    
        const promise = await fetch(`http://localhost:3000/api/products/${id}`);
        const product = await promise.json();   
        
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
        totalQuantity += quantity;
        totalPrice += product.price * quantity;
    }
    document.getElementById("totalQuantity")
    .innerHTML = totalQuantity;
    document.getElementById("totalPrice")
    .innerHTML = totalPrice + ',00';
}

function modifyEvents()
{
    const modifyItemValues = document.getElementsByClassName('itemQuantity');
    console.log(modifyItemValues);
    for (let modifyItemValue of modifyItemValues) {
        console.log(modifyItemValue);
        modifyItemValue.addEventListener('change', function(event) {
            let modifiedItem = event.target.closest('article');
            let modifiedId = modifiedItem.dataset.id;
            let modifiedColor = modifiedItem.dataset.color;
            let modifiedName = modifiedItem.dataset.name;
            items.find(function (item) {
                    if ( item[0] == modifiedId && item[1] == modifiedColor ) {
                        item[2] = modifyItemValue.value;
                    }
                });
            localStorage.setItem("cart", JSON.stringify(items));
            window.location.href = "cart.html";
            alert(`La quantité de ${modifiedName} ${modifiedColor} a été modifiée !`);
        });
    }
}

function deleteEvents()
{
    const deleteItemButtons = document.getElementsByClassName('deleteItem');
    console.log(deleteItemButtons);
    for (let deleteItemButton of deleteItemButtons) {
        console.log(deleteItemButton);
        deleteItemButton.addEventListener('click', function(event) {
            let deletedItem = event.target.closest('article');
            let deletedId = deletedItem.dataset.id;
            let deletedColor = deletedItem.dataset.color;
            let deletedName = deletedItem.dataset.name;
            const searchDeletedItem = items.find(item => item[0] == deletedId && item[1] == deletedColor);
            items = items.filter(item => item != searchDeletedItem);
            localStorage.setItem("cart", JSON.stringify(items));
            window.location.href = "cart.html";
            alert(`${deletedName} ${deletedColor} retiré du panier !`);
        });
    }
}

async function loadCart()
{
    await showCart();
    modifyEvents();
    deleteEvents();
}

loadCart();

const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const address = document.getElementById('address');
const city = document.getElementById('city');
const email = document.getElementById('email');
const regexNames = /[A-Za-zÀ-Ùà-ù '-.,]{1,31}$|^$/i;
const regexMail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
function validateFirstName(firstName) {
    if (regexNames.test(firstName) == true) {
        document.getElementById('firstNameErrorMsg').innerHTML = null;
        return true;
    } else {
        return false;
    }
}
function validateLastName(lastName) {
    if (regexNames.test(lastName) == true) {
        document.getElementById('lastNameErrorMsg').innerHTML = null;
        return true;
    } else {
        return false;
    }
}
function validateCity(city) {
    if (regexNames.test(city) == true) {
        document.getElementById('cityErrorMsg').innerHTML = null;
        return true;
    } else {
        return false;
    }
}
function validateMail(email) {
    if (regexMail.test(email) == true) {
        document.getElementById('emailErrorMsg').innerHTML = null;
        return true;
    } else {
        return false;
    }
}
function makeJsonOrder() {
    let contactInfo = {
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
    let jsonData = JSON.stringify({ contactInfo, products});
    return jsonData;
}

const orderButton = document.getElementById('order');
orderButton.addEventListener('click', function (event) {
        event.preventDefault();
        let orderFirstName = validateFirstName(firstName.value);
        let orderLastName = validateLastName(lastName.value);
        let orderCity = validateCity(city.value);
        let orderMail = validateMail(email.value);
        if ( orderFirstName == false || orderLastName == false || orderCity == false || orderMail == false ) {
            if (orderFirstName == false) {
                firstNameErrorMsg.innerHTML = "Entrez un prénom valide.";
            }
            if (orderLastName == false) {
                lastNameErrorMsg.innerHTML = "Entrez un nom valide.";
            }
            if (orderCity == false) {
                cityErrorMsg.innerHTML = "Entrez un nom de ville valide.";
            }
            if (orderMail == false) {
                emailErrorMsg.innerHTML = "Entrez une adresse mail valide (au format exemple@kanap.com)."
            }
            return;
        }
        let jsonOrder = makeJsonOrder();
        fetch('http://localhost:3000/api/products/order/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: jsonOrder,
        })
        .then((res) => res.json())
        .then((data) => {
            localStorage.clear();
            alert('On y est tkt!');
            window.location.href = `confirmation.html?id=${data.orderId}`;
        })
        .catch(() => {
            alert('Une erreur est survenue, veuillez réessayer plus tard.');
        })
    })