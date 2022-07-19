// On récupère l'identifiant de commande présent dans l'URL et on l'affiche sur la page.
const url = new URL(window.location);
const id = url.searchParams.get("id");
const orderId = document.getElementById("orderId");
orderId.innerHTML = id;