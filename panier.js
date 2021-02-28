let products = [] //contient les couples id/lentille (défini par cameraAdded) des cameras selelctionnées.
let sousTotal = []
let total = 0
let quantite = []
let values = []

/* Parcourir tous les couples identifiant/lentille stockés dans le navigateur */
let panierLengthParId = localStorage.length

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
            let output = '';
            const elementParent = document.querySelector('#wrapper');
            let elementTotal = document.getElementById('total');
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
let formValid = document.getElementById('myForm');
formValid.addEventListener('submit', valider);

function valider(e) {
    e.preventDefault();
    let prenom = document.getElementById('prenom');
    let firstName = "";
    firstName = document.getElementById('prenom').value;

    let nom = document.getElementById('nom');
    let lastName = "";
    lastName = document.getElementById('nom').value;

    let adresse = document.getElementById('adresse');
    let address = "";
    address = document.getElementById('adresse').value;

    let ville = document.getElementById('ville');
    let city = "";
    city = document.getElementById('ville').value;

    let email = document.getElementById('email');
    let mail = "";
    mail = document.getElementById('email').value;

    let validPrenom = myValidatorFunction(prenom);
    let validNom = myValidatorFunction(nom);
    let validAdresse = myValidatorFunction(adresse);
    let validVille = myValidatorFunction(ville);
    let validEmail = myValidatorFunction(email);

    prenom.nextSibling.innerHTML = "";
    nom.nextSibling.innerHTML = "";
    adresse.nextSibling.innerHTML = "";
    ville.nextSibling.innerHTML = "";
    email.nextSibling.innerHTML = "";

    let isFormOk = true;

    if (!validPrenom) {
        e.preventDefault();
        prenom.nextSibling.innerHTML = prenom.validationMessage;
        isFormOk = false;
    };
    if (!validNom) {
        e.preventDefault();
        nom.nextSibling.innerHTML = nom.validationMessage;
        isFormOk = false;
    };
    if (!validAdresse) {
        e.preventDefault();
        adresse.nextSibling.innerHTML = adresse.validationMessage;
        isFormOk = false;
    };
    if (!validVille) {
        e.preventDefault();
        ville.nextSibling.innerHTML = ville.validationMessage;
        isFormOk = false;
    };
    if (!validEmail) {
        e.preventDefault();
        email.nextSibling.innerHTML = email.validationMessage;
        isFormOk = false;
    };
    if (isFormOk) {
        let contact = {
            firstName,
            lastName,
            address,
            city,
            email: mail
        };
        fetch('http://localhost:3000/api/cameras/order', { //l'api doit envoyer l'objet "contact" et la liste "products" vers le serveur
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
                localStorage.setItem("orderId", json.orderId);
                localStorage.setItem("total", total);
                window.location = "confirmation.html";
            })
            .catch(err => console.log(err));
    };
}

function myValidatorFunction(elt) {
    let myValid = elt.checkValidity();
    console.log(myValid);
    if (!myValid) {
        isFormOk = false;
        elt.nextSibling.innerHTML = elt.validationMessage;
        return myValid;
    } else {
        return myValid;
    }
}