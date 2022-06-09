fetch("http://localhost:3000/api/products/")
    .then((res) => res.json())
    .then((products) => {
        for(let product in products) {
            document.getElementById("items")
            .innerHTML +=
            `<a href=".product.html?id=${products[product].id}">
                <article>
                    <img src="${products[product].imageUrl}" alt="${products[product].altTxt}">
                    <h3 class="ProductName'>${products[product].name}</h3>
                    <p class="productDescription">${products[product].description}</p>
                </article>
            </a>`
        };
    })