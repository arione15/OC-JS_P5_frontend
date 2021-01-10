/* dans la page "details.html", il faut obtenir l'identifiant de la camera à partir de l'url */
const url = new URL(window.location.href) 
/* window.location.href permet d'obtenir l'url de la page actuelle */
const id = url.searchParams.get("id") 
/* La propriété "searchParams" permet d'obtenir la valeur de la variable "id". 
La propriété en lecture seule searchParams de l'interface URL retourne
un objet URLSearchParams (dans l'exemple qui suit c'est url) permettant d'accéder aux arguments décodés de la requête GET contenu dans l'URL. 
On peut aussi écrire :
let url = (new URL(window.location.href)).searchParams;
let id = url.get("id"); pour la chaine de caractère
ou let id = parseInt(url.get("id")); pour le nombre
*/

/* Cette fonction permet de stocker les identifiants des cameras ajoutées au panier dans le navigateur (localStorage). Il faut stocker le id ET la lentille pour avoir un produit unique, sinon si j'ajoute une camera avec une lentille je ne pourrais plus rajouter la même camera avec une lentille différente !!! */


 /* construction d'un objet cameraAdded contenat l'id et la lentille de la caméra */
let cameraAddedTable = [] /* pas const cameraAddedTable*/ 
let i=0
function ajouter(){
    const cameraAdded = document.querySelector('#liste').value
     //faire un test pour dire au user de faire un choix
 
       // pbme si je retourne pour ajouter un autre modele avec un id différent, l'ancien ajout est perdu !!!! localStorage.setItem(cameraAddedTable, cameraAddedTable) ou localStorage.setItem(cameraAdded, cameraAdded) n'a pas résolu le pbme !!!! Le pbme a été résolu en utilisant getItem, push et setItem dans cet ordre avec 
       let cameraAddedTable = JSON.parse(localStorage.getItem(id)) || [] // comme ça ca ne l'écrase pas. Mettre getItem(cameraAdded) est mieux je pense que getItem(id) A VERIFIER !!!
       cameraAddedTable.push(cameraAdded)
       localStorage.setItem(id, JSON.stringify(cameraAddedTable));
/* autres syntaxes : localStorage[id] = id; ou encore localStorage.id = id; */
        console.log(cameraAddedTable)
       console.log(typeof(cameraAddedTable))
}

/* on passe l'identifiant de la camera obtenu à l'api */
fetch(`http://localhost:3000/api/cameras/${id}`)
    .then(resp => {
        console.log(resp)
        return resp.json()
    })
    .then(respJson => {
        console.log(respJson)
/* l'objet respJson contient toutes les informations de la camera. */
        let output = ''
        const elementParent = document.querySelector('#wrapper')
        output += `<img src="${respJson.imageUrl}" alt="#"
            class="card-img-top rounded-pill p-3">
    <div class="card-body text-center">
        <h5 class="card-title">Nom : ${respJson.name}</h5>
        <h6 class="card-title">Prix : ${respJson.price/100} €</h6>
        <p class="card-text">${respJson.description}</p>
  
        <select required id="liste" class="form-select mb-3" aria-label="Default select example">
			<option value="" disabled="disabled" selected="selected">--- choisissez la lentilles</option>
			${respJson.lenses.map(x_lentille => `<option value="${x_lentille}">${x_lentille}</option>`)}
        </select>
        <input onclick=ajouter() type="submit" value="Ajouter au panier" class="btn btn-primary"/>
        </div>`

		/* 
		<p id="demo" onclick="myFunction()">Click me.</p> ou bien : document.getElementById("demo").onclick = function() {myFunction()}; ou encore : document.getElementById("demo").addEventListener("click", myFunction);
        */
        elementParent.innerHTML = output
    })
