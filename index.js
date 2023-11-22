import http from "node:http";
import fs from "node:fs/promises";
import { sendError } from "./modules/send.js";
import { checkFileExist, createFileIfNotExist } from "./modules/checkFile.js";
import { handleComediansRequest } from "./modules/handleComediansRequest.js";
import { handleAddClient } from "./modules/handleAddClient.js";
import { handlClientsRequest } from "./modules/handlClientsRequest.js";
import { handleUpdateClient } from "./modules/handleUpdateClient.js";

const PORT = 8080;
const COMEDIANS = './comedians.json';
export const CLIENTS = './clients.json';

const startServer = async (port) => {
    if (!(await checkFileExist(COMEDIANS))) {
        return
    };

    await createFileIfNotExist(CLIENTS);

    const comediansData = await fs.readFile(COMEDIANS, "utf-8");
    const comedians = JSON.parse(comediansData);

    const server = http
        .createServer(async (req, res) => {
            try {
                res.setHeader("Access-Control-Allow-Origin", "*");             // Предоставление доступа определенным сайтам. * - значит всем!

                const segments = req.url.split('/').filter(Boolean);

                if (!segments.length) {
                    sendError(res, 404, `Not found`);
                    return;
                };

                const [resource, id] = segments;

                if (req.method === "GET" && resource === "comedians") {
                    // Получение stand up коммиков
                    handleComediansRequest(req, res, comedians, id);
                    return;
                };

                if (req.method === "POST" && resource === "clients") {
                    // Добавление клиента
                    handleAddClient(req, res);
                    return;
                };

                if (req.method === "GET" && resource === "clients" && id) {
                    // Получение клиента по номеру билета
                    handlClientsRequest(req, res, id);
                    return;
                };

                if (req.method === "PUT" && resource === "clients" && id) {
                    // Обновление клиента по номеру билета
                    handleUpdateClient(req, res, id);
                    return;
                };

                sendError(res, 404, 'Not found');
            } catch (error) {
                sendError(res, 500, `Ошибка сервера: ${error}`);
            }

        });

    server.listen(port, () => {
        console.log(`Сервер запущен на: http://localhost:${port}`);
    });

    server.on('error', (error) => {
        if (error = 'EADDRINUSE') {
            console.log(`Порт ${port} занят, пробуем запустить на порту ${port + 1}`);
            startServer(port + 1)
        } else {
            console.error(`Возникла ошибка: ${error}`);
        }
    })
}

startServer(PORT);