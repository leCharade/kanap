// Récupération de l'identifiant dans l'URL
var url = new URL(window.location.href);
var productId = url.searchParams.get("id");

// Récupération des données du canapé dont l'identifiant correspond à celui de l'URL
fetch(`http://localhost:3000/api/products/${productId}`)
    .then((res) => res.json())
    .then((product) => {

        // Intégration des données du canapé dans la page
        var elements = document.getElementsByClassName('item__img');
        elements[0].innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`;
        document.getElementById("title")
        .innerHTML = product.name;
        document.getElementById("price")
        .innerHTML = product.price;
        document.getElementById("description")
        .innerHTML = product.description;
        for(let color in product.colors) {
            document.getElementById("colors")
            .innerHTML += `<option value="${product.colors[color]}">${product.colors[color]}</option>`
        }
    })

// Récupération de la quantité de canapés renseignée
function quantityValue() {
    let quantity = document.getElementById("quantity");
    return quantity.value;
}
  
// Récupération de la couleur choisie
function colorValue() {
    let color = document.getElementById("colors");
    return color.value;
}

// Récupération des données du panier
function getCart() {
    let items = [];

    // Si le panier existe, on remplit items avec le contenu du panier
    if (localStorage.getItem("cart") != null) {
      items = JSON.parse(localStorage.getItem("cart"));
    }
    return items;
}

// Fonction d'ajout des produits dans le panier
function addToCart(productId, color, quantity) {

    // Si pas de couleur ou de quantité renseignée, pas d'ajout au panier
    if (quantity <= 0 || color == "") {
      return;
    }

    // Si le panier est vide, on ajoute le produit avec la couleur et la quantité renseignée
    let items = getCart();
    if (items.length == 0) {
      items = [[productId, color, quantity]];
    }

    // Sinon, on cherche dans le panier si un élément possède le même id et la même couleur que l'élément ajouté.
    else {
      let found = false;
      for (let i = 0; i < items.length; i++) {

        // Si l'élément correspondant est trouvé, on ajoute la quantité à la valeur de l'élément du panier.
        if (productId === items[i][0] && color === items[i][1]) {
          found = true;
          items[i][2] += quantity;
        }
      }

      // Si aucun élément correspondant n'est trouvé, on ajoute un nouvel élément.
      if (found == false) {
        let item = [productId, color, quantity];
        items.push(item);
      }
    }

    // Enfin, on convertit le résultat de la fonction en format JSON et on l'ajoute au panier.
    localStorage.setItem("cart", JSON.stringify(items));
}

// On permet au bouton Ajouter au panier d'exécuter la fonction addToCart lorsqu'il est cliqué.
const addToCartBtn = document.getElementById("addToCart");
addToCartBtn.addEventListener("click", () => {
    let quantity = parseInt(quantityValue());
    let color = colorValue();
    addToCart(productId, color, quantity);
});