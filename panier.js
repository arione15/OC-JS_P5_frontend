let panier = [] //contient les cameras ajoutées au panier
let products = [] //contient les identifiants des cameras à commander
let total = 0

for (let i = 0; i < localStorage.length; i++) { //parcourir tous les identifiants stockés dans le navigateur
    let id = localStorage.key(i); //récupérer les identifiants stockés dans le navigateur

        fetch(`http://localhost:3000/api/cameras/${id}`)
            .then(resp => {
                console.log(resp)
                return resp.json()
            })
            .then(respJson => {
                console.log(respJson)
                panier.push(respJson) //stocker les réponses dans la liste "panier"
                console.log(panier);

                products.push(panier[i]._id) //stocker les identifiants des cameras à commander dans la liste "products"
                console.log(products);

                total = total + panier[i].price //calculer le total

                let output = ''
				const elementParent = document.querySelector('#wrapper')
				const elementTotal = document.querySelector('#total')

                for (let j = 0; j < panier.length; j++) {
                    output += `<a href="details.html?id=${panier[j]._id}"><img src="${panier[j].imageUrl}" alt="#"
                                class="card-img-top">
                            </a>
                            <div class="card-body">
                                <h5 class="card-title">Nom : ${panier[j].name}</h5>
                                <h6 class="card-title">Prix : ${panier[j].price/100} €</h6>
                            </div>`
                }
                elementParent.innerHTML = output
                elementTotal.innerHTML = "Total: " + total/100 + " €"
            })
}

//Envoyer le formulaire de confirmation
document.getElementById("myForm").addEventListener("submit", Confirmer) //ajouter un event listener pour le formulaire

// cette fonction permet d'envoyer le formulaire vers le serveur
function Confirmer(e) {
    e.preventDefault() //utiliser toujours cette fonction avec les formulaires pour empecher le navigateur de recharger la page lors de l'envoi du formulaire

    //obtenir les données du formulaire
    let firstName = document.getElementById("prenom").value
    let lastName = document.getElementById("nom").value
    let city = document.getElementById("ville").value
    let address = document.getElementById("adresse").value
    let email = document.getElementById("email").value

    //créer l'objet "contact" contenant les données du formulaire
    let contact = {
        firstName,
        lastName,
        address,
        city,
        email
    }

    //l'api doit envoyer l'objet "contact" et la liste "products" vers le serveur
    fetch('http://localhost:3000/api/cameras/order', {
        method: "POST",
        headers: {
            "Accept": 'application/json, text/plain, "/"',
            "Content-type": "application/json"
        },
        body: JSON.stringify({ contact, products }) //JSON.stringify pour convertir JSON en string
    })
        .then(response => response.json())
        .then(json => {
            console.log(json)

            //stocker les variables "orderId" et "total" pour les utiliser dans la page "confirmation.html" 
            localStorage.setItem("orderId", json.orderId) 
            localStorage.setItem("total", total) 

            //redériger l'utilisateur vers la page "confirmation.html" après la confirmation de la commande
			window.location = "confirmation.html"
			// var adresseActuelle = window.location;
 			// window.location = nouvelleAdresse;
        })
        .catch(err => console.log(err))
}


