export const sendData = (res, data) => {
    res.writeHead(200, {
        "Content-type": "text/json; charset=utf-8",     // charset=utf-8 для вывода текста на кирилице
    });

    res.end(JSON.stringify(data));
};

export const sendError = (res, statusCode, errorMessage) => {
    res.writeHead(statusCode, {
        "Content-type": "text/plain; charset=utf-8",
    });
    res.end(errorMessage);
};