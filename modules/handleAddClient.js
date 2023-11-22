import fs from "node:fs/promises";
import { sendData, sendError } from "./send.js";
import { CLIENTS } from "../index.js";

export const handleAddClient = (req, res) => {
    let body = '';

    try {
        req.on("data", chunk => {
            body += chunk;
        });
    } catch (error) {
        console.log(`Ошибка при чтении запроса`);
        sendError(res, 500, 'Ошибка сервера при чтении запроса')
    };

    req.on("end", async () => {
        try {
            const newClient = JSON.parse(body);

            if (!newClient.fullName || !newClient.phone || !newClient.ticketNumber || !newClient.booking) {
                sendError(res, 400, 'Неверные основные данные клиента')
                return;
            };

            if (newClient.booking &&
                (!newClient.booking.length || !Array.isArray(newClient.booking) || !newClient.booking.every(item => item.comedian && item.time))) {
                sendError(res, 400, 'Неверно заполнены поля бронирования')
                return;
            };

            const clientData = await fs.readFile(CLIENTS, 'utf-8');
            const clients = JSON.parse(clientData);

            clients.push(newClient);

            await fs.writeFile(CLIENTS, JSON.stringify(clients));
            sendData(res, newClient);
        } catch (error) {
            console.log(`Ошибка при сохранении клиента: ${error}`);
        }
    })
}