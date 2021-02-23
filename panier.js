let products = [] //contient les couples id/lentille (défini par cameraAdded) des cameras selelctionnées.
let sousTotal = []
let total = 0
let quantite = []
let values = []

/* Parcourir tous les couples identifiant/lentille stockés dans le navigateur */
let panierLengthParId = localStorage.length
console.log(panierLengthParId) // affiche le nombre d'id différents (voir le setItem du localStorage) même si un id contient +ieurs lentilles ca ne compte que 1. Il faut donc aussi boucler sur le nbre de lentilles de chaque id. Car le fetch nous renvoi toutes les infos de l'id concerné.

function getBasket() {
    if (localStorage.getItem("basket") != null) {
        return JSON.parse(localStorage.getItem("basket"))
    } else {
        return []
    }
}

function saveBasket(basket) {
    localStorage.setItem("basket", JSON.stringify(basket))
}

const cart = getBasket();
let jsonData = []; // contient les infos correspondant à l'id de la camera ajoutée au panier

for (let i = 0; i < cart.length; i++) {
    let id = cart[i].id; /* Récupère les id car le key de notre localStorage est id */
    let valuesId = JSON.parse(localStorage.getItem(id)) // récupère la VALUE correspondante à la KEY id : ici la VALUE est un tableau ?? contenant les lentilles
    values.push(valuesId); // quantite.push(valuesId.length)

    fetch(`http://localhost:3000/api/cameras/${id}`) // car besoin des infos de l'api pour l'image, le descriptif et le prix
        .then(resp => {
            return resp.json();
        })
        .then(respJson => {
            jsonData.push(respJson);
            cart.push(respJson); //stocker les réponses dans la liste "cart"
            products.push(id); //
            let output = ''
            const elementParent = document.querySelector('#wrapper')
            let elementTotal = document.getElementById('total')
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
                myArticle.remove();
                elementTotal.innerHTML = total / 100
            } else if (jsonData.length == 0) {
                localStorage.clear()
                myArticle.remove()
                elementTotal.innerHTML = 0
            }
        }
    }
}

/* ************* Envoyer le formulaire de confirmation ************* */
const formValid = document.getElementById('myButton');
formValid.addEventListener('click', valider);

// fonction valider() : permet d'envoyer le formulaire vers le serveur après vérification
function valider(e) {
    let prenom = document.getElementById('prenom');
    let missPrenom = document.getElementById('prenom_manquant');
    let firstName = document.getElementById('prenom').value;

    let nom = document.getElementById('nom');
    let missNom = document.getElementById('nom_manquant');
    let lastName = document.getElementById('nom').value;

    let adresse = document.getElementById('adresse');
    let missAdresse = document.getElementById('adresse_manquant');
    let address = document.getElementById('adresse').value;

    let ville = document.getElementById('ville');
    let missVille = document.getElementById('ville_manquant');
    let city = document.getElementById('ville').value;

    let email = document.getElementById('email');
    let missEmail = document.getElementById('email_manquant');
    let mail = document.getElementById('email').value;

    let isFormOk = true;


    //Validation du prénom :
    if (!prenom.validity.patternMismatch) {
        e.preventDefault();
        missPrenom.innerHTML = prenom.validationMessage;
        missPrenom.style.color = 'red';
        isFormOk = false;
        var validityState = prenom.validity;
        console.log(validityState);
    }

    //Validation du nom :
    if (!nom.validity.patternMismatch) {
        e.preventDefault();
        missNom.innerHTML = nom.validationMessage;
        missNom.style.color = 'red';
        isFormOk = false;
    }

    //Validation de l'adresse :
    if (!adresse.validity.patternMismatch) {
        e.preventDefault();
        missAdresse.innerHTML = adresse.validationMessage;
        missAdresse.style.color = 'red';
        isFormOk = false;
    }

    //Validation de la ville :
    if (!ville.validity.patternMismatch) {
        e.preventDefault();
        missVille.innerHTML = ville.validationMessage;
        missVille.style.color = 'red';
        isFormOk = false;
    }

    //Validation de l'email :
    if (!email.validity.patternMismatch) {
        e.preventDefault();
        missEmail.innerHTML = email.validationMessage;
        missEmail.style.color = 'red';
        isFormOk = false;
    }

    if (isFormOk) {
        let contact = {
            firstName,
            lastName,
            address,
            city,
            mail
        };
        console.log(contact, products);

        //l'api doit envoyer l'objet "contact" et la liste "products" vers le serveur
        fetch('http://localhost:3000/api/cameras/order', {
                method: "POST",
                headers: {
                    "Accept": 'application/json, text/plain, "/"',
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    contact,
                    products
                })
            })
            .then(response => response.json())
            .then(json => {
                console.log(json);
                localStorage.setItem("orderId", json.orderId);
                localStorage.setItem("total", total);
                window.location = "confirmation.html";
            })
            .catch(err => console.log(err));
    }
}