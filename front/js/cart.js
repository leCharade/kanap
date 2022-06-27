// Récupération des données des différents canapés du catalogue
function fetchCart () {
    let items = [];
    if (localStorage.getItem("cart") != null) {
        items = JSON.parse(localStorage.getItem("cart"));
    }
    return items;
}

// function changeQuantity(id, color, quantity) {
//     let items = fetchCart();
//     for (let i = 0; i < items.length; i++) {
//       if (id === items[i][0] && color === items[i][1]) {
//         items[i][2] = this.value;
//       }
//       localStorage.setItem("cart", JSON.stringify(items));
//       window.location.reload();
//     }
// }

// function deleteItem(id, color) {
//     let items = fetchCart();
//     for (i = 0; i < items.length; i++) {
//       if (id === items[i][0] && color === items[i][1]) {
//         items.splice(i, 1);
//         localStorage.setItem("cart", JSON.stringify(items));
//         window.location.reload();
//       }
//     }
// }

let items = fetchCart();

let totalQuantity = 0;
let totalPrice = 0;

function showCart() {
    if (localStorage.getItem("cart") != null) {
        for (let i = 0; i < items.length; i++) {
            let id = items[i][0];
            let color = items[i][1];
            let quantity = items[i][2];        
            fetch(`http://localhost:3000/api/products/${id}`)
                .then((res) => res.json())
                .then((product) => {
                    document.getElementById("cart__items")
                    .innerHTML += `<article class="cart__item" data-id="${product.id}" data-color="${color}">
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

                const changeQuantity = document.getElementsByClassName('changeQuantity');
                changeQuantity[i].onChange = items[i][2];

                // const changeQuantity = document.getElementByClassName("changeQuantity");
                // changeQuantity[items[i][0]].onChange = changeQuantity(items[i][0];items[i][1];items[i][2]) {

                // }

                // const deleteItem = document.getElementByClassName("deleteItem");
                // deleteItem[items[i][0]].onClick = deleteItem(items[i][0];items[i][1]) {

                // }

                totalQuantity += quantity;
                totalPrice += product.price * quantity;
                console.log(totalQuantity);
                console.log(totalPrice);
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
}
showCart();