//dans la page "details.html", il faut obtenir l'identifiant de la camera à partir de l'url
const url = new URL(window.location.href) //window.location.href permet d'obtenir l'url de la page actuelle
const id = url.searchParams.get("id") //"searchParams" permet d'obtenir la valeur de la variable "id"
console.log(id)

//cette fonction permet de stocker les identifiants des cameras ajoutées au panier dans le navigateur (localStorage)
function ajouter(){
	localStorage.setItem(id, id)
	// autres syntaxes : localStorage[id] = id; ou encore localStorage.id = id;
}

//on passe l'identifiant de la camera obtenu vers l'api
fetch(`http://localhost:3000/api/cameras/${id}`) /*?imageUrl*/
    .then(resp => {
        console.log(resp)
        return resp.json()
    })
    .then(respJson => {
		console.log(respJson)
		//l'objet respJson contient toutes les informations de la camera
        let output = ''
        const elementParent = document.querySelector('#wrapper')
        output += `<a href="details.html?id=${respJson._id}"><img src="${respJson.imageUrl}" alt="#"
            class="card-img-top rounded-circle"></a>
    <div class="card-body">
        <h5 class="card-title">Nom : ${respJson.name}</h5>
        <h6 class="card-title">Prix : ${respJson.price/100} €</h6>
        <p class="card-text">${respJson.description}</p>

        <select class="form-select" aria-label="Default select example">
            <option selected>Type de lentilles</option>
            <option value="2">${respJson.lenses[0]}</option>
            <option value="2">${respJson.lenses[1]}</option>
		</select>
		<input onclick=ajouter() type="submit" value="Ajouter au panier"/>
	</div>`
		/*for(let i=0; i<respJson.lenses.length; i++){
			<option value="2">${respJson.lenses[i]}</option>
		*/
	
		/* 
		<p id="demo" onclick="myFunction()">Click me.</p> ou bien : document.getElementById("demo").onclick = function() {myFunction()}; ou encore : document.getElementById("demo").addEventListener("click", myFunction);
		*/

        elementParent.innerHTML = output
    })
