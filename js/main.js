const produitSell = "furniture";
const APIURL = "http://localhost:3000/api/" + produitSell + "/";

let idProduit = "";
if (localStorage.getItem("userBasket")) {
	console.log("Le panier de l'utilisateur existe dans le localStorage");
} else {
	console.log("Le panier n'existe pas");

  	let panierInit = [];
  	localStorage.setItem("userBasket", JSON.stringify(panierInit));
};

let contact;
let products = [];

let userBasket = JSON.parse(localStorage.getItem("userBasket"));

function getProduits(){
	return new Promise((resolve) => {
		let request = new XMLHttpRequest();
		request.onreadystatechange = function() {
			(this.readyState == XMLHttpRequest.DONE && this.status == 200) 
			{
				resolve(JSON.parse(this.responseText));
				console.log("Connection ok");
			}
		}
		request.open("GET", APIURL + idProduit);
		request.send();
	});
};

async function allProductsList(){
    const produits = await getProduits();

    let listProduct = document.createElement("section");
    listProduct.setAttribute("id", "list-articles");

    let main = document.getElementById("main");
    main.appendChild(listProduct);

  
    produits.forEach((produit) =>
    { 
        let bloc = document.createElement("article");
        let blocPhoto = document.createElement("div");
        let imageArticle = document.createElement("img");
        let blocDescription = document.createElement("div");
        let blocGauche = document.createElement("div");
        let nomArticle = document.createElement("p");
        let description = document.createElement("p");
        let blocDroit = document.createElement("div");
        let prix = document.createElement("p");
        let lienArticle = document.createElement("a");
     
        bloc.setAttribute("class","article");
        blocPhoto.setAttribute("class","bloc_photo");
        imageArticle.setAttribute("class", "img_article");
        blocDescription.setAttribute("class","bloc_description");
        blocGauche.setAttribute("class", "bloc_gauche"); 
        nomArticle.setAttribute("class","name_article");
        description.setAttribute("class","description_article");
        blocDroit.setAttribute("class","bloc_droit");
        prix.setAttribute("class","price_article");
        lienArticle.setAttribute("class", "selection_article");
        lienArticle.setAttribute("href", "produit.html?id=" + produit._id);
      
        listProduct.appendChild(bloc);
        bloc.appendChild(blocPhoto);
        blocPhoto.appendChild(imageArticle);
        bloc.appendChild(blocDescription);
        blocDescription.appendChild(blocGauche);
        blocGauche.appendChild(nomArticle);
        blocGauche.appendChild(description);
        blocDescription.appendChild(blocDroit);
        blocDroit.appendChild(prix);
        blocDroit.appendChild(lienArticle);

        imageArticle.src = produit.imageUrl;
        nomArticle.textContent = produit.name;
        description.textContent = produit.description;
        prix.textContent = produit.price/100 + ",00€";
        lienArticle.textContent = "Découvrir";
  });
};

async function detailProduit(){
        idProduit = location.search.substring(4);
        const produitSelected = await getProduits();
        console.log("Vous regardez la page du produit id_"+ produitSelected._id);

        document.getElementById("img_product").setAttribute("src", produitSelected.imageUrl);
        document.getElementById("name_product").innerHTML = produitSelected.name;
        document.getElementById("description_product").innerHTML = produitSelected.description;
        document.getElementById("price_product").innerHTML = produitSelected.price / 100 + ",00€";
    
        produitSelected.varnish.forEach((produit) => {
            let optionProduit = document.createElement("option");
            document.getElementById("option_select").appendChild(optionProduit).innerHTML = produit;
    });
};

function addPanier(){
        let inputBuy = document.getElementById("add_product");
        inputBuy.addEventListener("click", async function() {
            const produits = await getProduits();
        userBasket.push(produits);
        localStorage.setItem("userBasket", JSON.stringify(userBasket));
        console.log("Le produit a été ajouté au panier");
        setTimeout(function() {
            document.getElementById('add_done').textContent = "Vous avez ajouté ce produit à votre panier !";
        },500);
        function add_done_remove(){
            document.getElementById("add_done").textContent="";
        }
        window.setTimeout(add_done_remove, 4000);
    });
};

function addition(){
    if(JSON.parse(localStorage.getItem("userBasket")).length > 0){
      document.getElementById("empty_basket").remove();

      let facture = document.createElement("table");
      let ligneTableau = document.createElement("tr");
      let colonneNom = document.createElement("th");
      let colonnePrixUnitaire = document.createElement("th");
      let colonneRemove = document.createElement("th");
      let ligneTotal = document.createElement("tr");
      let colonneRefTotal = document.createElement("th");
      let colonnePrixPaye = document.createElement("td");

      let factureSection = document.getElementById("basket-resume");
      factureSection.appendChild(facture);
      facture.appendChild(ligneTableau);
      ligneTableau.appendChild(colonneNom);
      colonneNom.textContent = "Nom du produit";
      ligneTableau.appendChild(colonnePrixUnitaire);
      colonnePrixUnitaire.textContent = "Prix du produit";

      let i = 0;
      
      JSON.parse(localStorage.getItem("userBasket")).forEach((produit)=>{
      
        let ligneProduit = document.createElement("tr");
        let nomProduit = document.createElement("td");
        let prixUnitProduit = document.createElement("td");
        let removeProduit = document.createElement("i");


        ligneProduit.setAttribute("id", "produit"+i);
        removeProduit.setAttribute("id", "remove"+i);
        removeProduit.setAttribute('class', "fas fa-trash-alt annulerProduit");
        removeProduit.addEventListener('click', annulerProduit.bind(i));
        i++;

    
        facture.appendChild(ligneProduit);
        ligneProduit.appendChild(nomProduit);
        ligneProduit.appendChild(prixUnitProduit);
        ligneProduit.appendChild(removeProduit);

   
        nomProduit.innerHTML = produit.name;
        prixUnitProduit.textContent = produit.price / 100 + " €";
    });


      facture.appendChild(ligneTotal);
      ligneTotal.appendChild(colonneRefTotal);
      colonneRefTotal.textContent = "Total à payer";
      ligneTotal.appendChild(colonnePrixPaye);
      colonnePrixPaye.setAttribute("id", "total_sum");
      let totalPaye = 0;
      JSON.parse(localStorage.getItem("userBasket")).forEach((produit)=>{
      	totalPaye += produit.price / 100;
      });
      console.log(`Total à payer : ${totalPaye}€`);
      document.getElementById("total_sum").textContent = `${totalPaye},00€`;
  };
}

function annulerProduit(i){
    console.log(`Enlever le produit à l'index ${i}`);
    userBasket.splice(i, 1); 
    console.log(`Admin : ${userBasket}`);
    localStorage.clear();
    console.log(`localStorage vidé`);
    localStorage.setItem('userBasket', JSON.stringify(userBasket));
    console.log(`localStorage mis à jour`);
    window.location.reload();
};


function checkPanier(){
  let etatPanier = JSON.parse(localStorage.getItem("userBasket"));
  if(etatPanier.length < 1) {
    alert("Votre panier est vide");
    return false;
  } else {
    console.log("Le panier est rempli");
    JSON.parse(localStorage.getItem("userBasket")).forEach((produit) => {
      products.push(produit._id);
    });
    console.log("Le tableau envoyé à l'API contiendra les id de produit(s) suivant(s) : " + products)
    return true;
  }
};


envoiDonnees = (objetRequest) => {
  return new Promise((resolve) => {
    let request = new XMLHttpRequest();
    request.open('POST', APIURL + "order");
    request.setRequestHeader("Content-type", "application/json");
    request.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 201) {
          resolve(JSON.parse(this.responseText));
          window.location = "./confirmation.html";
          contact = {};
          products = [];
          localStorage.clear();
        } else {
          alert("Erreur");
        }
    }
    request.send(objetRequest);  
  }
)};

function validForm(){ 
    if(checkPanier() == true){
      let objet = {
        contact,
        products
      };
      let objetRequest = JSON.stringify(objet);
      console.log("L'envoi peut etre fait");
      console.log("Admin : " + objetRequest);
      envoiDonnees(objetRequest);
    }else{
      console.log("Erreur");
    };
};

function resultOrder(){
	if(sessionStorage.getItem("order") != null){
    document.location = "./confirmation.html";
    let order = JSON.parse(sessionStorage.getItem("order"));
    document.getElementById("lastName").innerHTML = order.contact.lastName;
    document.getElementById("orderId").innerHTML = order.orderId;
    sessionStorage.removeItem("order");
  }else{
    alert("Aucune commande passée, vous êtes arrivé ici par erreur");
    window.location = "./index.html";
  }
}

