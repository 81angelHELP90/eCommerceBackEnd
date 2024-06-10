//CLIENTE:
const socket = io();

socket.on("addProducs", newProducts => {
    let sectionCards = document.getElementById("cardsProducts");
    
    handleDOMElement(newProducts, sectionCards);
});

socket.on("removeProducs", newProducts => {
    let sectionCards = document.getElementById("cardsProducts");
    sectionCards.innerHTML = "";

    handleDOMElement(newProducts, sectionCards);
});

function handleDOMElement(listProducts, sectionCards){
    if (listProducts.length > 0) {
        listProducts.forEach(prod => {
            let card = document.createElement("div");
            card.className = "card my-1 mx-1";

            let cardBody = document.createElement("div");
            cardBody.className = "card-body";

            let cardTitle = document.createElement("h5");
            cardTitle.className = "card-title text-center mb-4"
            cardTitle.innerHTML = prod.title;

            let cardDescrption = document.createElement("p");
            cardDescrption.innerHTML = "Descrption: " + prod.description;

            let cardCategoria = document.createElement("p");
            cardCategoria.innerHTML = "Categoria: " +prod.category;

            let cardPrecio = document.createElement("p");
            cardPrecio.innerHTML = "Precio: $ " + prod.price;

            cardBody.appendChild(cardTitle);
            cardBody.appendChild(cardDescrption);
            cardBody.appendChild(cardCategoria);
            cardBody.appendChild(cardPrecio);
            card.appendChild(cardBody);

            sectionCards.appendChild(card);
        });
    }
}

function addProduct(oEvent){
    try {
        let product = {};
        let detailProduct = oEvent.parentElement.parentElement.getElementsByTagName("p");
        let cartIdElement = document.getElementById("userCartId");

        product.cartId = cartIdElement.textContent;
        product.title = oEvent.parentElement.parentElement.getElementsByTagName("h5")[0].textContent;
        product.description = detailProduct[0].textContent.split(":")[1].trim();
        product.category = detailProduct[1].textContent.split(":")[1].trim();
        product.price = detailProduct[2].textContent.split("$")[1].trim();
        product.idProd = detailProduct[3].textContent.split(":")[1].trim();

        sendData(product);
    } catch (error) {
        console.log("Error al obtener los datos: ", error)
    }
}

function sendData(product){
    let url = "http://localhost:8080/api/carts/addProduct/";

    fetch(url, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
        },
        body: JSON.stringify(product)
    })
    .then(res => 
        res.json() 
    )
    .then(response  => {
        console.log("Respuesta del back: ", response)
    })
    .catch(error => 
        console.log("Error: ", error)
    );
}
