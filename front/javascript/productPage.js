var url = new URL(window.location.href);
var productId = url.searchParams.get("id");
console.log(productId);
fetch(`http://localhost:3000/api/products/${productId}`)
    .then((res) => res.json())
    .then((product) => {
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