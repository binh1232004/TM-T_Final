export function numberWithSeps(x, sep = ",") {
    if (typeof x !== "number" && typeof x !== "string" && !(x instanceof String)) return x;
    if (typeof x === "number") return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, sep);
    return x.replace(/\B(?=(\d{3})+(?!\d))/g, sep);
}

export function parseNumberWithSeps(x, sep = ",") {
    return parseInt(x.replace(new RegExp(sep, "g"), ""));
}