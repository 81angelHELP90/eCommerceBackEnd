class Helper {
    constructor() { }

    calTotalCart(products) {
        let total = 0;

        try {
            products.forEach(product => {
                total += product.cantidad * product.price;
            });

            return total.toFixed(2);
        } catch (error) {
            console.log("Error al calcular el total: ", error);
            return total;
        }
    }
}

export const helper = new Helper();

