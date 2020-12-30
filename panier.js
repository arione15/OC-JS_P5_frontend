let panier = [] //contient les infos correspondant à l'id de la camera ajoutée au panier (même si on n'a choisi qu'une seule lentille, ca récupère toutes les infos de la camera qui a cet id pas uniquement la lentille selectionnée !!)
let products = [] //contient les couples id/lentille (défini par cameraAdded) des cameras selelctionnées.
let sousTotal = []
let total = 0
let quantite = []
let values = []

/** Parcourir tous les couples identifiant/lentille stockés dans le navigateur */
let panierLengthParId = localStorage.length
console.log(panierLengthParId) // donne le nombre d'id différents (voir le setItem du localStorage) même si un id contient +ieurs lentilles ca ne compte que 1. Il faut donc aussi boucler sur le nbre de lentilles de chaque id. Car le fetch nous renvoi toutes les infos, contenu dans l'API, de l'id concerné

for (let i = 0; i < panierLengthParId; i++) {
    let id = localStorage.key(i) /* Récupère les id car le key de notre localStorage est id */
    let valuesId = JSON.parse(localStorage.getItem(id)) // récupère la VALUE correspondante à la KEY id : ici la VALUE est un tableau contenant les couples id/lentille (voir localStorage.setItem)
    console.log(valuesId);
    values.push(valuesId)
    console.log(values)
    quantite.push(valuesId.length)

    fetch(`http://localhost:3000/api/cameras/${id}`) // car besoin des infos de l'api pour, UIQUEMENT, l'image, le descriptif et le prix !!!
        .then(resp => {
            //console.log(resp)
            return resp.json()
        })
        .then(respJson => {
            console.log(respJson) // affiche les infos de chaque respJson donc ici de chaque id un par un pas comme lorsqu'on utilise push 
            panier.push(respJson) //stocker les réponses dans la liste "panier"
            console.log(panier) // affiche les infos de tout les id (boucle sur i complète)

            products.push(id) //
            console.log(products) // affiche les infos de tout le products (boucle sur i complète)
            console.log(products.length) // ca affiche 1 puis 2 puis 3 ????? car à chaque itération il rajoute la même chose, le même shémas !!!

            let output = ''
            const elementParent = document.querySelector('#wrapper')
            const elementTotal = document.querySelector('#total')

            output += panier.map((camera, x) => {
                return (`
                    <tr>
                    <td id="photoUnitaire"><a href="details.html?id=${camera._id}"><img src="${camera.imageUrl}" alt="#" class="card-img-top">
                    </a></td>
                    <td id="modele">${camera.name}</td>
                    <td id="lentilleUnitaire">${values[x]}</td>
                    <td id="prixUnitaire">${camera.price/100}</td>
                    <td id="quantite">${quantite[x]}</td>
                    <td id="sousTotal">${quantite[x] * camera.price/100}</td>
                    </tr>
                    `)
            })

            sousTotal = panier.map((camera,x) => camera.price * quantite[x])
            total = sousTotal.reduce((acc, curr) => acc + curr)
            elementParent.innerHTML = output
            elementTotal.innerHTML = total/100 + " €"
        })
}

//Envoyer le formulaire de confirmation
const myFormElement = document.getElementById("myForm")
myFormElement.addEventListener("submit", Confirmer) //ajouter un event listener pour le formulaire
console.log(50)

// cette fonction permet d'envoyer le formulaire vers le serveur
function Confirmer(e) {
    e.preventDefault() //utiliser toujours cette fonction avec les formulaires pour empecher le navigateur de recharger la page lors de l'envoi du formulaire
    //obtenir les données du formulaire
    let firstName = document.getElementById("prenom").value
    let lastName = document.getElementById("nom").value
    let city = document.getElementById("ville").value
    let address = document.getElementById("adresse").value
    let email = document.getElementById("email").value
    
    //let prenomElement = document.getElementById("prenom")
    let prenom_m = document.getElementById("prenom_manquant")

    //let nomElement = document.getElementById("nom")
    let nom_m = document.getElementById("nom_manquant")

    //let adressElement = document.getElementById("adresse")
    let adress_m = document.getElementById("adresse_manquant")

    //let cityElement = document.getElementById("ville")
    let city_m = document.getElementById("ville_manquant")

    //let emailElement = document.getElementById("nom")
    let email_m = document.getElementById("email_manquant")
    let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (firstName === ""){
        prenom_m.innerHTML="Veuillez renseigner le Prénom !"
        prenom_m.style.color = "red"
    } else if (lastName === ""){
        nom_m.innerHTML="Veuillez renseigner le Nom !"
        nom_m.style.color = "red"
    } else if(address === "") {
        adress_m.innerHTML="Veuillez renseigner l'adresse !"
        adress_m.style.color = "red"
    }else if (city === "") {
        city_m.innerHTML="Veuillez renseigner la ville !"
        city_m.style.color = "red"
    } else if(email === "" || email.match(regex) === null) {
        email_m.innerHTML="Veuillez renseigner une adresse mail valide !"
        email_m.style.color = "red"
    } else {
        firstName.trim()
        lastName.trim()
        console.log(200)
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
}


