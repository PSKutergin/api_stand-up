import fs from "node:fs/promises";
import { sendData, sendError } from "./send.js";
import { CLIENTS } from "../index.js";
import { readRequestBody } from "./helpers.js";

export const handleUpdateClient = async (req, res, id) => {
    try {
        const body = await readRequestBody(req);
        const updateDataClient = JSON.parse(body);

        if (!updateDataClient.fullName || !updateDataClient.phone || !updateDataClient.ticketNumber || !updateDataClient.booking) {
            sendError(res, 400, 'Неверные основные данные клиента')
            return;
        };

        if (updateDataClient.booking &&
            (!updateDataClient.booking.length || !Array.isArray(updateDataClient.booking) || !updateDataClient.booking.every(item => item.comedian && item.time))) {
            sendError(res, 400, 'Неверно заполнены поля бронирования')
            return;
        };

        const clientData = await fs.readFile(CLIENTS, 'utf-8');
        const clients = JSON.parse(clientData);

        const clientIndex = clients.findIndex(c => c.ticketNumber === id);

        if (clientIndex === -1) {
            sendError(res, 404, "Клиент с данным номером билета не найден");
        };

        clients[clientIndex] = {
            ...clients[clientIndex],
            ...updateDataClient,
        };

        // Object.assign(clients[clientIndex], updateDataClient)            // Повторение вышеуказанного кода (стр. 42-45)

        await fs.writeFile(CLIENTS, JSON.stringify(clients));
        sendData(res, clients[clientIndex]);
    } catch (error) {
        console.error(`Ошибка при сохранении клиента: ${error}`);
        sendError(res, 500, "Ошибка сервера при обновлении данных")
    }
}