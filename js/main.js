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



let userBasket = JSON.parse(localStorage.getItem("userBasket"));

function getProduits(){
  return new Promise((resolve) => {
    let request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if(this.readyState == XMLHttpRequest.DONE && this.status == 200) 
      {
        resolve(JSON.parse(this.responseText));
        console.log("connection ok");
        error = document.getElementById("error");
        if(error){
          error.remove();
        }
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


function checkInput(){
  
    let checkString = /^[a-zA-Z ,.'-]/;
    let checkMail = /.+@.+\..+/;
    let checkAdresse = /^[^@&"()!_$*€£`%+=\/;?#]+$/;

    let checkMessage = "";

    let formNom = document.getElementById("name").value;
    let formPrenom = document.getElementById("firstname").value;
    let formMail = document.getElementById("email").value;
    let formAdresse = document.getElementById("address").value;
    let formVille = document.getElementById("city").value;


    if(checkString.test(formNom) == false){
      checkMessage = "Nom : Format de votre nom incorrect";
    }else{
      console.log("Nom ok");
    };
    if(checkString.test(formPrenom) == false){
      checkMessage = checkMessage + "\n" + "Prénom : Format de votre prénom incorrect";
    }else{
      console.log("Prénom ok");
    };
    if(checkMail.test(formMail) == false){
      checkMessage = checkMessage + "\n" + "e-mail : Votre email doit être au format xxxx@yyy.zzz";
    }else{
      console.log("Adresse mail ok");
    };
    if(checkAdresse.test(formAdresse) == false){
      checkMessage = checkMessage + "\n" + `Adresse : L'un ou plusieurs des caractères suivants sont interdits [^@&"()!_$*€£%+=`;
    }else{
      console.log("Adresse ok");
    };
    if(checkString.test(formVille) == false){
      checkMessage = checkMessage + "\n" + "Ville : Format de votre ville incorrect";
    }else{
      console.log("Ville ok")
    };
    if(checkMessage != ""){
      alert("ATTENTION" + "\n" + checkMessage);
    } else {
      contact = {
        name: formNom,
        firstName: formPrenom,
        email: formMail,
        address: formAdresse,
        city: formVille
      };
    return true;
    };
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

let contact;
let products = [];
let url = "http://localhost:3000/api/furniture/order";

envoiDonnees = (objetRequest, url) => {
  return new Promise((resolve) => {
    let request = new XMLHttpRequest();
    request.onload = function () {
      if (this.readyState == XMLHttpRequest.DONE && this.status == 201) {
        sessionStorage.setItem("order", this.responseText);
        window.location = "./confirmation.html";
        resolve(JSON.parse(this.responseText));
        console.log(objetRequest);
        } else {
          alert("Erreur");
        }
    };
    request.open("POST", url);
    request.setRequestHeader("Content-Type", "application/json");
    request.send(objetRequest);
    console.log(objetRequest);
  });
};

function validForm(){ 
  let commande = document.getElementById("formulaire");
  commande.addEventListener("submit", (event) => {
    event.preventDefault();
    if(checkPanier() == true && checkInput() != null) {
      console.log("L'envoi peut etre fait");
      userBasket.forEach((produit) => {
        products.push(produit._id);
      });
      console.log("Ce tableau sera envoyé à l'API : " + products);


      let objet = {
        contact,
        products
      };

      let objetRequest = JSON.stringify(objet);
      envoiDonnees(objetRequest, url);
      console.log(objet);
      
      contact = {};
      products = [];
      localStorage.clear();
    }else{
      console.log("Erreur");
    }
  });
};  

function resultOrder(){
	if (sessionStorage.getItem("order") != null) {
    let order = JSON.parse(sessionStorage.getItem("order"));
    document.getElementById("firstName").innerHTML = order.contact.firstName;
    document.getElementById("orderId").innerHTML = order.orderId;
    console.log(order);
    sessionStorage.removeItem("order");
  }else{
    alert("Aucune commande passée, vous êtes arrivé ici par erreur");
    window.location = "./index.html";
  }
};

