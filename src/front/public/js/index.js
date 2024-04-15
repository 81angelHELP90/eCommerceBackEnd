//CLIENTE:
const socket = io();
let sectionCards = document.getElementById("cardsProducts");

socket.on("addProducs", newProducts => {
    handleDOMElement(newProducts);
});

socket.on("removeProducs", newProducts => {
    sectionCards.innerHTML = "";
    handleDOMElement(newProducts);
});

function handleDOMElement(listProducts){
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
