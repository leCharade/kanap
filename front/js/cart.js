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

let totalQuantity = 0;
let totalPrice = 0;

async function showCart() {
    if (localStorage.getItem("cart") != null) {
        for (let i = 0; i < items.length; i++) {
            let id = items[i][0];
            let color = items[i][1];
            let quantity = items[i][2];        
            fetch(`http://localhost:3000/api/products/${id}`)
                .then((res) => res.json())
                .then((product) => {
                    document.getElementById("cart__items")
                    .innerHTML += `<article class="cart__item" data-id="${product._id}" data-color="${color}">
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
                if (i = items.length) {
                    document.getElementById("totalQuantity")
                    .innerHTML = totalQuantity;
                    document.getElementById("totalPrice")
                    .innerHTML = totalPrice + ',00';
                    }
                }
            )
        }
    }
    let deleteItemButtons = document.getElementsByClassName('deleteItem');
    console.log(deleteItemButtons);
    console.log(deleteItemButtons[0]);


    for (let deleteItemButton of deleteItemButtons) {
        console.log(deleteItemButton);
        deleteItemButton.addEventListener('click', function(event) {
            console.log('Deleted!');
        });

    // deleteItemButtons[0].addEventListener('click', function (event) {
    // console.log('Deleted!');
    // });
    }
}
showCart();



// async function deleteItem() {
//     await showCart;
//     let deleteItemButtons = document.getElementsByClassName('.deleteItem');
//     console.log(deleteItemButtons);
//     console.log(deleteItemButtons[0]);

//     deleteItemButtons.addEventListener('click', function (event) {
//     console.log('Deleted!');
//     });
// }
// deleteItem();
//     let deleteItemButtons = document.getElementsByClassName('.deleteItem');
//     console.log(deleteItemButtons);
//     console.log(deleteItemButtons[0]);
// for (let deleteItemButton of deleteItemButtons) {
//     console.log(deleteItemButton);
//     deleteItemButton.addEventListener('click', function deleteItem() {
//         console.log('Deleted!');
//     });
// }