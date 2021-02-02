
var panierProduct = localStorage.getItem('panier') ? JSON.parse(localStorage.getItem('panier')) : [];

function addItemToStorage(id, lens){
  console.log(panierProduct);
	let product = panierProduct.find(elt => elt.id === id && elt.lens === lens);
	if(product === undefined){
		panierProduct.push({id:id, lens:lens, qte:1});
		}else{
			product.qte +=1;
		}
localStorage.setItem('panier', JSON.stringify(panierProduct));
}
  addItemToStorage("jhjhghj", "123");
  addItemToStorage("jhjhghj", "123");

  addItemToStorage("abc", "456");

  addItemToStorage("jhdfdfjhghj", "121212123");

function removeItemFromStorage(id, lens){
   console.log(panierProduct);

	let product = panierProduct.find(elt => elt.id === id && elt.lens === lens);
	if(product === undefined){
		alert("Le produit n'est pas présent dans le panier");
				}
		else{
			if(product.qte < 1)
      {
				product.qte -=1;
			}
			else{
				let productIndex = panierProduct.findIndex(elt => elt.id === id && elt.lens === lens);
				panierProduct.splice(productIndex, 1);
         console.log(panierProduct);
			}
      localStorage.setItem('panier', JSON.stringify(panierProduct));

		}
}
