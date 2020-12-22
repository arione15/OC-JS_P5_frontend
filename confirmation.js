const total = localStorage.getItem("total") // obtenir le total
const orderId = localStorage.getItem("orderId") //obtenir "orderId"

document.querySelector("#orderId").innerHTML = "Identifiant de commande: " + orderId
document.querySelector("#total").innerHTML = "Total: " + total

localStorage.clear() //vider localStorage après avoir passé la commande
