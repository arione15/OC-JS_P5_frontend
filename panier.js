let products = [] //contient les couples id/lentille (défini par cameraAdded) des cameras selelctionnées.
let sousTotal = []
let total = 0
var quantite = []
let values = []

/* Parcourir tous les couples identifiant/lentille stockés dans le navigateur */
let panierLengthParId = localStorage.length
console.log(panierLengthParId) // affiche le nombre d'id différents (voir le setItem du localStorage) même si un id contient +ieurs lentilles ca ne compte que 1. Il faut donc aussi boucler sur le nbre de lentilles de chaque id. Car le fetch nous renvoi toutes les infos de l'id concerné.

function getBasket() {
    if (localStorage.getItem("basket") != null) {
        return JSON.parse(localStorage.getItem("basket"))
    }
    else {
        return []
    }
}
function saveBasket(basket){
    localStorage.setItem("basket", JSON.stringify(basket))
}

const cart = getBasket();
var jsonData = []; // contient les infos correspondant à l'id de la camera ajoutée au panier

for (let i = 0; i < cart.length; i++) {
    let id = cart[i].id; /* Récupère les id car le key de notre localStorage est id */
console.log(id);
    let valuesId = JSON.parse(localStorage.getItem(id)) // récupère la VALUE correspondante à la KEY id : ici la VALUE est un tableau ?? contenant les lentilles

    values.push(valuesId); // quantite.push(valuesId.length)

    fetch(`http://localhost:3000/api/cameras/${id}`) // car besoin des infos de l'api pour l'image, le descriptif et le prix
        .then(resp => {
            return resp.json();
        })
        .then(respJson => {
            jsonData.push(respJson);
            console.log(respJson); // affiche les infos de chaque respJson donc ici de chaque id un par un pas comme lorsqu'on utilise push 
            cart.push(respJson); //stocker les réponses dans la liste "cart"
            console.log(cart); // affiche les infos de tout les id (boucle sur i complète)

            products.push(id); //
            console.log(products); // affiche les infos de tout le products (boucle sur i complète)
            console.log(products.length); // ca affiche 1 puis 2 puis 3 ????? car à chaque itération il rajoute la même chose, le même shémas !!!

            let output = ''
            const elementParent = document.querySelector('#wrapper')
            var elementTotal = document.getElementById('total')
            console.log(cart[i]);
            output += jsonData.map((camera, x) => { // je mape sur les differents id donc les differentes cameras. si j'ai 3 id donc 3 modeles de cameras differents, alors x =0,1,2.
                return (`
                    <tr id=${camera._id}>
                    <td id="photoUnitaire"><a href="details.html?id=${camera._id}"><img src="${camera.imageUrl}" alt="#" class="card-img-top">
                    </a></td>
                    <td id="modele">${camera.name}</td>
                    <td id="lentilleUnitaire">${cart[x].lenses}</td>
                    <td id="prixUnitaire">${camera.price / 100}</td>
                    <td id="quantite">${cart[x].quantity}</td>
                    <td id="sousTotal">${cart[x].quantity * camera.price / 100}</td>
                    <td class="text-center">
                    <button class="btn-del btn btn-danger" onclick="supprimerArticle('${camera._id}')">
                    <i class="fas fa-trash-alt"></i>
                    </button>  
                    </td>
                    </tr>
                    `)
            })

            sousTotal = jsonData.map((camera, x) => camera.price * cart[x].quantity)
            total = sousTotal.reduce((acc, curr) => acc + curr)
            elementParent.innerHTML = output
            elementTotal.innerHTML = total / 100 + " €"
        })
}

//let sousTotalArticle = document.querySelector(".sousTotal").innerHTML
let boutonSupprime = document.querySelector(".btn-del");

function supprimerArticle(id) {
    let myArticle = document.getElementById(id);
    let elementTotal = document.getElementById('total')

    for (let i = 0; i < cart.length; i++) {
        if (jsonData[i]._id === id) {
            jsonData.splice(i, 1)
            
            if (jsonData.length > 0) {
                cart.splice(i, 1)
                sousTotal = jsonData.map((camera, x) => camera.price * cart[x].quantity)
                total = sousTotal.reduce((acc, curr) => acc + curr)
                saveBasket(cart)
                console.log(total);
                myArticle.remove()
                elementTotal.innerHTML = total / 100
            }
            else if (jsonData.length == 0) {
                localStorage.clear()
                myArticle.remove()
                elementTotal.innerHTML = 0
            }
        }
    }
}

//Envoyer le formulaire de confirmation
const myFormElement = document.getElementById("myForm");
myFormElement.addEventListener("submit", confirmer); //ajouter un event listener pour le formulaire

// cette fonction permet d'envoyer le formulaire vers le serveur
function confirmer(e) {
    e.preventDefault(); //utiliser toujours cette fonction avec les formulaires pour empecher le navigateur de recharger la page lors de l'envoi du formulaire
    
    //obtenir les données du formulaire
    let firstName = ""; // on initialise les champs à "" pour vaoir des champs vide à chaque nouvelle soumission du formulaire
    firstName = document.getElementById("prenom").value;

    let lastName = "";
    lastName = document.getElementById("nom").value;

    let city = "";
    city = document.getElementById("ville").value;

    let address = "";
    address = document.getElementById("adresse").value;

    let email = "";
    email = document.getElementById("email").value;

    //let prenomElement = document.getElementById("prenom")
    let prenom_m = document.getElementById("prenom_manquant");

    //let nomElement = document.getElementById("nom")
    let nom_m = document.getElementById("nom_manquant");

    //let adressElement = document.getElementById("adresse")
    let adress_m = document.getElementById("adresse_manquant");

    //let cityElement = document.getElementById("ville")
    let city_m = document.getElementById("ville_manquant");

    //let emailElement = document.getElementById("nom")
    let email_m = document.getElementById("email_manquant");
    let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let isFormOk = true;
    if (firstName === "") {
        prenom_m.innerHTML = "Veuillez renseigner le Prénom !";
        prenom_m.style.color = "red";
        isFormOk = false;
    }
    if (lastName === "") {
        nom_m.innerHTML = "Veuillez renseigner le Nom !";
        nom_m.style.color = "red";
        isFormOk = false;
    }
    if (address === "") {
        adress_m.innerHTML = "Veuillez renseigner l'adresse !";
        adress_m.style.color = "red";
        isFormOk = false;
    }
    if (city === "") {
        city_m.innerHTML = "Veuillez renseigner la ville !";
        city_m.style.color = "red";
        isFormOk = false;
    }
    if (email === "" || email.match(regex) === null) {
        email_m.innerHTML = "Veuillez renseigner une adresse mail valide !";
        email_m.style.color = "red";
        isFormOk = false;
    }
    if(isFormOk) {
        firstName.trim();
        lastName.trim();
        //créer l'objet "contact" contenant les données du formulaire
        let contact = {
            firstName,
            lastName,
            address,
            city,
            email
        };

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
                window.location = "confirmation.html";
                // var adresseActuelle = window.location; // window.location = nouvelleAdresse;
            })
            .catch(err => console.log(err))
    }
}