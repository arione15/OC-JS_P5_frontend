
fetch(`http://localhost:3000/api/cameras`)
	.then(resp => {
		console.log(resp)
		return resp.json()
	})
	.then(respJson => {
		console.log(respJson)
		let output = ''
		const elementParent = document.querySelector('#wrapper')
		respJson.forEach(camera => {

			

			// let elementLien=document.createElement('a')
			// elementLien.setAttribute('href', `details.html?id=${camera._id}`)

			// let elementImage=document.createElement('img')
			// elementImage.setAttribute('src', camera.imageUrl)
			// elementImage.setAttribute('alt', '#')
			// elementImage.classList.add('card-img-top', 'rounded-circle')

			// let elementCard=document.createElement('div')
			// elementCard.classList.add('card-body')

			// let elementNom=document.createElement('h5')
			// elementNom.classList.add('card-title')
			// elementNom.innerHTML=`Nom : ${camera.title}`

			// let elementPrix=document.createElement('h6')
			// elementPrix.classList.add('card-title')
			// elementPrix.innerHTML=`${camera.price/100}  €`

			// let elementDescription=document.createElement('p')
			// elementDescription.classList.add('card-text')
			// elementDescription.innerHTML=`${camera.description}`




			// elementParent.appendChild(elementLien)
			// elementLien.appendChild(elementImage)

			// elementParent.appendChild(elementCard)
			// elementCard.appendChild(elementNom)
			// elementCard.appendChild(elementPrix)
			// elementCard.appendChild(elementDescription)



			output += `<a href="details.html?id=${camera._id}"><img src="${camera.imageUrl}" alt="#"
								class="card-img-top rounded-circle"></a>
						<div class="card-body">
							<h5 class="card-title">Nom : ${camera.name}</h5>
							<h6 class="card-title">Prix : ${camera.price/100} €</h6>
								<p class="card-text">${camera.description}</p>
						</div>`
			// l'objet "camera" contient la variable "name" et non pas "title", il faut
			// donc utiliser "camera.name" au lieu de "camera.title"
			// <h5 class="card-title">Nom : ${camera.title}</h5>
			elementParent.innerHTML = output

		})

	})
