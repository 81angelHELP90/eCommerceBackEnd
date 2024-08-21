//CLIENTE:
const socket = io();

/*###### --- socket ---- #######*/
//addProducs
socket.on("addProducs", newProducts => {
    let sectionCards = document.getElementById("cardsProducts");

    handleDOMElement(newProducts, sectionCards);
});

//removeProducs
socket.on("removeProducs", newProducts => {
    let sectionCards = document.getElementById("cardsProducts");
    sectionCards.innerHTML = "";

    handleDOMElement(newProducts, sectionCards);
});

//Back-notificación de nuevo usuario conectado: 
socket.on("nuevoUsuario", userName => {
    let newUser = `${userName} se a conectado al chat`
    toast(newUser, "#47AD48");
});

//Chat - sendMessage
function sendMessage(oEvent) {
    let message = document.getElementById("messageInput");
    let _messsage = message.value;

    if (_messsage !== "") {
        message.value = "";
        //Mensaje al back: Aca.. prodria enviar tambien el nombre
        socket.emit("mensaje", _messsage.trim(), socket.id);
    }
}

socket.on("nuevoMensaje", (message, user) => {
    let divMensajes = document.getElementById("mensajes");

    divMensajes.innerHTML += `<p><strong>${user}</strong><br>${message}</p>`

});

socket.on("userDisconnect", user => {
    let userOff = `El usuario ${user} a salido del chat`;
    toast(userOff, "#fc2d20");
});
/*###### --- fin socket ---- #######*/

function handleDOMElement(listProducts, sectionCards) {
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
            cardCategoria.innerHTML = "Categoria: " + prod.category;

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

function addProduct(oEvent) {
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

function sendData(product) {
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
        .then(response => {
            toast(response.Message, "#7bd5f5");
        })
        .catch(error =>
            console.log("Error: ", error)
        );
}

const toast = (msg, backgroundColor) => {
    const $toast = document.querySelectorAll(".toast")[0];
    const $toastbody = $toast.getElementsByClassName("toast-body")[0];
    const bootToast = new bootstrap.Toast($toast);

    $toast.style.backgroundColor = backgroundColor;

    if ($toastbody) {
        $toastbody.innerText = msg;
        bootToast.show();
    }
}

function endPurchase(event) {
    let items = document.getElementsByClassName("card-body");
    let productData = [];
    let cartObj = {};

    for (let i = 0; i < items.length; i++) {
        let info = items[i].getElementsByTagName("p")[4].innerText.split("|");

        productData.push({
            stockDisponible: info[0].trim(),
            stockRestante: info[1].trim(),
            idProd: info[2].trim(),
            cantidad: info[3].trim()
        });
    }

    let p = document.getElementById("idCart");
    let cid = p.innerText;
    let url = "http://localhost:8080/cart/purchase/"

    cartObj.dataProducts = productData;
    cartObj.cartID = cid;

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ cartObj })
    })
        .then(res =>
            res.json()
        )
        .then(response => {
            this.openPopUpFinalCompra(response);
        })
        .catch(error =>
            console.log("Error: ", error)
        );
}

function openPopUpFinalCompra(data) {
    let divMensajes = document.getElementById("popUpFinalCompra");
    let purchaseDatetime = new Date(data.Payload.purchase_datetime);
    let fecha = `${purchaseDatetime.getDate()}/${purchaseDatetime.getMonth()}/${purchaseDatetime.getFullYear()}`

    divMensajes.innerHTML += `<p><strong>Fecha de la compra:</strong><br>${fecha}</p>`
    divMensajes.innerHTML += `<p><strong>Total de la compra:</strong><br>${data.Payload.amount}</p>`
}

function redirect() {
    location.href = location.origin + "/productos";
}

function sendDataByRecoveryPass() {
    let mailElement = document.getElementById("userMail");

    if (mailElement.value !== "") {
        let url = "http://localhost:8080/recoveryPass/";
        let mail = mailElement.value;

        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ mail: mail })
        })
            .then(res =>
                res.json()
            )
            .then(response => {
                console.log(response);
                mailElement.value = "";
            })
            .catch(error => {
                console.log("Error: ", error);
                mailElement.value = "";
            });
    } else {
        console.log("NO INGRESO MAIL");
    }
}

function getDataToChangePass() {
    let pass1 = document.getElementById("pass1");
    let pass2 = document.getElementById("pass2");
    let user = document.getElementById("user");
    let pError = document.getElementById("passError");

    if (pass1.value !== pass2.value) {
        pError.textContent = "las contraseñas ingresadas no coinciden";
        pError.style.color = "#fc2d20";
        pError.hidden = false;
    } else {
        pError.hidden = true;

        //Enviar la nueva pass al back:
        if (pass1.value !== "" && user.value !== "")
            sendNewPass(pass1.value, user.value);
    }
}

function sendNewPass(newPass, email) {
    let url = "http://localhost:8080/changeUserPass/";

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ newPass: newPass, email: email })
    })
        .then(res => res.json())
        .then(response => {
            console.log(response);
            if (response.success) {
                toast(response.success, "#7bd5f5");

                setTimeout(function () {
                    location.href = location.origin + "/login";
                }, 1000);

            } else {
                let pass1 = document.getElementById("pass1");
                let pass2 = document.getElementById("pass2");

                pass1.value = "";
                pass2.value = "";

                toast(response.error, "#fc2d20");
            }
        })
        .catch(error => {
            console.log("Error: ", error);
        });
}

function closeExpiredTokenModal() {
    let expiredTokenModal = document.getElementById("expiredTokenModal");

    expiredTokenModal.remove();
}

function changeRol(oEvent) {
    let uid = oEvent.getAttribute("data-valor");
    let url = `http://localhost:8080/api/users/premium/${uid}/`;

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: []
    })
        .then(res =>
            res.json()
        )
        .then(response => {
            if (response.status === "Success") {
                toast(response.Message, "#7bd5f5");

                setTimeout(function () {
                    logout();
                }, 2000);
            } else
                toast(response.Message, "#fc2d20");
        })
        .catch(error =>
            console.log("Error: ", error)
        );
}

function logout() {
    const url = 'http://localhost:8080/api/sessions/logout';

    fetch(url)
        .then(res => {
            res.json()
        })
        .then(response => {
            console.log('Datos recibidos:', response);
        })
        .catch(error => {
            console.error('Hubo un problema con la solicitud Fetch', error);
        });

        
    location.href = location.origin + "/login";
}



