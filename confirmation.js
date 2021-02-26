const total = localStorage.getItem("total") // obtenir le total
const orderId = localStorage.getItem("orderId") //obtenir "orderId"

document.querySelector("#orderId").innerHTML = `<h3 class="h3">Numéro de la commande : </h3><h5 class="h3">${orderId}</h5>`
document.querySelector("#total").innerHTML = "Total : " + total/100 + " €"

localStorage.clear() //vider localStorage après avoir passé la commande

