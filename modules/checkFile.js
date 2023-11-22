import fs from "node:fs/promises";

export const checkFile = async (path, createIfMissing) => {
    if (createIfMissing) {
        try {
            // Проверяем наличие файла в директории
            await fs.access(path);
        } catch (error) {
            // Создается файл с пустым массивом
            await fs.writeFile(path, JSON.stringify([]));
            console.error(`Файл ${path} создан!`);
            return true;
        };
    };

    try {
        // Проверяем наличие файла в директории
        await fs.access(path);
    } catch (error) {
        console.error(`Файл ${path} не найден!`);
        return false;
    };

    return true;
};