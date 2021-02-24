/* Cette fonction permet de stocker les identifiants des cameras ajoutées au panier dans le navigateur (localStorage). Il faut stocker le id ET la lentille pour avoir un produit unique. */
function add(id) {
    const lenses = document.querySelector("#liste").value;
    const lensesList = [];
    let cameraAddedTable = getBasket();
    let camera = cameraAddedTable.find(cam => cam.id == id); // 
    if (camera != null) {
        camera.lenses.push(lenses);
        camera.quantity++;
    } else {
        lensesList.push(lenses);
        cameraAddedTable.push({
            "id": id,
            "lenses": lensesList,
            "quantity": 1
        });
    }
    saveBasket(cameraAddedTable);
}

function getBasket() {
    if (localStorage.getItem("basket") != null) {
        return JSON.parse(localStorage.getItem("basket"));
    } else {
        return [];
    }
}

function saveBasket(basket) {
    localStorage.setItem("basket", JSON.stringify(basket));
}

/* on passe l'identifiant de la camera obtenu à l'api */
retrieveFromUrl(`http://localhost:3000/api/cameras/${getParamFromUrl('id')}`)
    .then(respJson => {
        /* l'objet respJson contient toutes les informations de la camera. */
        document.querySelector('#wrapper').innerHTML = displayElement(respJson);
        addListeners();
    })

function displayElement(camera) {
    return `
        <img src="${camera.imageUrl}" alt="#"
        class="card-img-top rounded-pill p-3">
        <div class="card-body text-center">
                <h5 class="card-title">Nom : ${camera.name}</h5>
                <h6 class="card-title">Prix : ${camera.price/100} €</h6>
                <p class="card-text">${camera.description}</p>
            <select required id="liste" class="form-select mb-3" aria-label="Default select example">
                <option value="" disabled="disabled" selected="selected">--- choisissez la lentilles</option>
                ${camera.lenses.map(x_lentille => `<option value="${x_lentille}">${x_lentille}</option>`)}
            </select>
            <input type="submit" value="Ajouter au panier" class="btn btn-primary" id="addToCart"/>
        </div>
`;
}

function addListeners() { // ca évite de mettre un onclick dans le input type submit
    document.getElementById("addToCart").addEventListener('click', (e) => {
        add(getParamFromUrl('id'))
    })
}