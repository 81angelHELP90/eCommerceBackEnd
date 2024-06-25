import ticketModel from "./models/TicketModels.js";

export class TicketDAO {
    constructor() {}

    insertTicket = async (ticket) => {
        try {
            const newTicket = await ticketModel.create(ticket);

            return newTicket;
        } catch (error) {
            console.log(`Error al crear el nuevo ticket: ${error}`);
        }
    }
}