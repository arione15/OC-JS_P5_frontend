let panier = [] //contient les cameras ajoutées au panier
let products = [] //contient les couples identifiant/lentille des cameras à commander. Un tableau d'objets ???
let total = 0

/** Parcourir tous les couples identifiant/lentille stockés dans le navigateur */
for (let i = 0; i < localStorage.length; i++) { 
    let id = JSON.stringify(localStorage.key(i)) /* Récupère les couples identifiant/lentille */
console.log(JSOPN.parse(id))
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
                /** Comment stocker le couple id/lense ???? */
                console.log(products);

                total = total + panier[i].price //calculer le total

                let output = ''
				const elementParent = document.querySelector('#wrapper')
				const elementTotal = document.querySelector('#total')
				const elementLentille = document.querySelector('#lentilleUnitaire')
				const elementPrixUnitaire = document.querySelector('#prixUnitaire')

                for (let j = 0; j < panier.length; j++) {
                    output += `<a href="details.html?id=${panier[j]._id}"><img src="${panier[j].imageUrl}" alt="#" class="card-img-top">
                            </a>`
							elementLentille.innerHTML = panier[j].lenses
							elementPrixUnitaire.innerHTML = panier[j].price/100 + " €"

							/*
							<div class="card-body">
								<h5 class="card-title">Nom : ${panier[j].name}</h5>
								<h7 class="card-title">Lentille : ${panier[j].lenses}</h7>
                                <h6 class="card-title">Prix : ${panier[j].price/100} €</h6>
							</div>
							*/
								/*divCard.innerHTML = output
							elementParent.innerHTML = divCard*/
                }
                elementParent.innerHTML = output
				elementTotal.innerHTML = total/100 + " €"
				
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
        body: JSON.stringify({ contact, products })
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


