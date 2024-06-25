import { TicketDAO as ticketDao } from "../dao/ticketDao.js";

class TicketService {
    constructor(dao){
        this.dao = dao;
    }

    insertTicket = async (newTicket) => {
        return await this.dao.insertTicket(newTicket);
    };
}

export const ticketService = new TicketService(new ticketDao);