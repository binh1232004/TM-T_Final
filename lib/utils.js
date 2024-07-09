export function numberWithSeps(x, sep = ",") {
    if (typeof x !== "number" && typeof x !== "string" && !(x instanceof String)) return x;
    if (typeof x === "number") return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, sep);
    return x.replace(/\B(?=(\d{3})+(?!\d))/g, sep);
}

export function parseNumberWithSeps(x, sep = ",") {
    return parseInt(x.replace(new RegExp(sep, "g"), ""));
}

export function makeId(length = 32) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return `${Date.now()}${result}`;
}
