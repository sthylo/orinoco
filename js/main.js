/* Lien avec l'API */
const produitSell = "furniture";
const APIURL = "http://localhost:3000/api/" + produitSell + "/";

//----------PRODUITS----------//

/* Requête pour récupérer les produits avec l'API */
let idProduit = "";

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

/* Lien pour afficher les produits sous forme de liste dans la section "main" de index.html */
async function allProductsList(){
    const produits = await getProduits();

    let listProduct = document.createElement("section");
    listProduct.setAttribute("id", "list-articles");

    let main = document.getElementById("main");
    main.appendChild(listProduct);

/* création de la structure html dans la section "main" de index.html */    
    produits.forEach((produit) => { 
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

/* Attribution des classes aux éléments html créés dans index.html */     
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

/* Hiérarchie des éléments html créés dans index.html */        
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

/* Ajout du contenu des éléments créés dans index.html */
        imageArticle.src = produit.imageUrl;
        nomArticle.textContent = produit.name;
        description.textContent = produit.description;
        prix.textContent = produit.price/100 + ",00€";
        lienArticle.textContent = "Découvrir";
  });
};

/* Lien avec la page produit.html pour afficher les détails du produit sélectionné */
async function detailProduit(){
        idProduit = location.search.substring(4);
        const produitSelected = await getProduits();
        console.log("Vous regardez la page du produit id_"+ produitSelected._id);

/* Ajout du contenu des éléments html sur la page produit.html */
        document.getElementById("img_product").setAttribute("src", produitSelected.imageUrl);
        document.getElementById("name_product").innerHTML = produitSelected.name;
        document.getElementById("description_product").innerHTML = produitSelected.description;
        document.getElementById("price_product").innerHTML = produitSelected.price / 100 + ",00€";

/* Création de l'option de personalisation du produit sur la page produit.html */    
        produitSelected.varnish.forEach((produit) => {
            let optionProduit = document.createElement("option");
            document.getElementById("option_select").appendChild(optionProduit).innerHTML = produit;
    });
};

//----------PANIER----------//

/* Création et initialisation du panier utilisateur */
let userBasket = JSON.parse(localStorage.getItem("userBasket"));
if (localStorage.getItem("userBasket")) {
  console.log("Le panier de l'utilisateur existe dans le localStorage");
} else {
  console.log("Le panier n'existe pas");

    let panierInit = [];
    localStorage.setItem("userBasket", JSON.stringify(panierInit));
};

/* création de la fonction d'ajout au panier avec un message de confirmation */ 
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

/* création du panier avec la fonction de calcul */
function addition(){
    if(JSON.parse(localStorage.getItem("userBasket")).length > 0){
      document.getElementById("empty_basket").remove();

/* création de la structure du panier dans la page panier.html */
      let facture = document.createElement("table");
      let ligneTableau = document.createElement("tr");
      let colonneNom = document.createElement("th");
      let colonnePrixUnitaire = document.createElement("th");
      let colonneRemove = document.createElement("th");
      let ligneTotal = document.createElement("tr");
      let colonneRefTotal = document.createElement("th");
      let colonnePrixPaye = document.createElement("td");

/* Positionnement des éléments du panier dans la page panier.html */
      let factureSection = document.getElementById("basket-resume");
      factureSection.appendChild(facture);
      facture.appendChild(ligneTableau);
      ligneTableau.appendChild(colonneNom);
      colonneNom.textContent = "Nom du produit";
      ligneTableau.appendChild(colonnePrixUnitaire);
      colonnePrixUnitaire.textContent = "Prix du produit";

/* Affichage des articles dans le panier */
      let i = 0;
      JSON.parse(localStorage.getItem("userBasket")).forEach((produit)=>{
        let ligneProduit = document.createElement("tr");
        let nomProduit = document.createElement("td");
        let prixUnitProduit = document.createElement("td");
        let removeProduit = document.createElement("i");

/* Attribution des classes aux éléments du panier */ 
        ligneProduit.setAttribute("id", "produit"+i);
        removeProduit.setAttribute("id", "remove"+i);
        removeProduit.setAttribute('class', "fas fa-trash-alt annulerProduit");
        removeProduit.addEventListener('click', annulerProduit.bind(i));
        i++;

/* Création des éléments html dans la page panier.html */    
        facture.appendChild(ligneProduit);
        ligneProduit.appendChild(nomProduit);
        ligneProduit.appendChild(prixUnitProduit);
        ligneProduit.appendChild(removeProduit);

/* Contenu des lignes du panier */   
        nomProduit.innerHTML = produit.name;
        prixUnitProduit.textContent = produit.price / 100 + " €";
    });

/* Calcul et affichage du montant total à payer en fonction des éléments présents dans le panier */
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

/* Fonction de suppression de produit dans le panier */
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

//----------FORMULAIRE----------//
/* Fonction de vérification de conformité des champs du formulaire */
function checkInput(){
/* Configuration de la regex */  
    let checkString = /^[a-zA-Z ,.'-]/;
    let checkMail = /.+@.+\..+/;
    let checkAdresse = /^[^@&"()!_$*€£`%+=\/;?#]+$/;
/* Envoi du message si la regex n'est pas respectée */
    let checkMessage = "";
/* Récupération des inputs du formulaire */
  let formNom = document.getElementById("formNom").value;
  let formPrenom = document.getElementById("formPrenom").value;
  let formMail = document.getElementById("formMail").value;
  let formAdresse = document.getElementById("formAdresse").value;
  let formVille = document.getElementById("formVille").value;

/* Test de chaque input du formulaire */
    if(checkString.test(formNom) == false){
      checkMessage = "Nom : Nom incorrect";
    }else{
      console.log("Nom ok");
    };
    if(checkString.test(formPrenom) == false){
      checkMessage = checkMessage + "\n" + "Prénom : Prénom incorrect";
    }else{
      console.log("Prénom ok");
    };
    if(checkMail.test(formMail) == false){
      checkMessage = checkMessage + "\n" + "e-mail : Votre email doit être au format xxxx@yyy.zzz";
    }else{
      console.log("Adresse mail ok");
    };
    if(checkAdresse.test(formAdresse) == false){
      checkMessage = checkMessage + "\n" + "Adresse : Adresse incorrecte";
    }else{
      console.log("Adresse ok");
    };
    if(checkString.test(formVille) == false){
      checkMessage = checkMessage + "\n" + "Ville : Ville incorrecte";
    }else{
      console.log("Ville ok")
    };
    /* Si un des champs n'est pas conforme, envoi du message d'alerte */
    if(checkMessage != ""){
      alert("ATTENTION" + "\n" + checkMessage);
    } else {
    return true;
    };
};

//----------VALIDATION----------//

/* Fonction de vérification du panier vide/rempli */
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
    return true;
  }
};

/* Objets demandés par l'API pour valider la commande */
let contact;
let products = [];

/* Fonction de validation du formulaire au click de validation de commande sur la page panier.html */
function validForm(){
  let envoiPost = document.getElementById("envoiPost");
  envoiPost.addEventListener("click", function(event){
    event.preventDefault();
/* Si le panier est rempli et que les inputs du formulaire sont correctement remplis = création des objets */
    if(checkPanier() == true && checkInput() == true){
      let contact = {
        lastName: document.getElementById("formNom").value,
        firstName: document.getElementById("formPrenom").value,
        email: document.getElementById("formMail").value,
        address: document.getElementById("formAdresse").value,
        city: document.getElementById("formVille").value
      }
      let objet = {
        contact,
        products
      };
/* Envoi des objets vers l'API pour redirection vers la page confirmation.html */      
      let objetRequest = JSON.stringify(objet);
      var request = new XMLHttpRequest();
      request.open("POST", "http://localhost:3000/api/furniture/order");
      request.setRequestHeader("Content-Type", "application/json");
      request.onreadystatechange = function() {
        if (this.readyState == XMLHttpRequest.DONE){
        console.log(this.responseText);
        localStorage.setItem('order', this.responseText);
        window.location.href = "./confirmation.html";
        }
      }
      request.send(objetRequest);
    }else{
      console.log("Admin : ERROR");
    };
  });
};

//----------CONFIRMATION----------//

/* Fonction d'affichage des éléments de confirmation de commande sur la page confirmation.html */
function resultOrder(){
	if(localStorage.getItem("order") != null){
    let order = JSON.parse(localStorage.getItem("order"));
    document.getElementById("firstName").innerHTML = order.contact.firstName;
    document.getElementById("orderId").innerHTML = order.orderId;
    console.log(order);
/* Une fois la commande validée = on vide le panier */    
    localStorage.removeItem("order");
    localStorage.clear();
  }else{
    alert("Aucune commande passée, vous êtes arrivé ici par erreur");
    window.location = "./index.html";
  }
};

