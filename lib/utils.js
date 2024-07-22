import { message } from "antd";

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

export function useMessage() {
    const [messageApi, contextHolder] = message.useMessage({
        maxCount: 3,
    });
    const error = (message, onFulfilled) => {
        messageApi.open({
            type: "error",
            content: message,
        }).then(() => {
            if (onFulfilled) {
                onFulfilled();
            }
        });
    };

    const success = (message, onFulfilled) => {
        messageApi.open({
            type: "success",
            content: message,
        }).then(() => {
            if (onFulfilled) {
                onFulfilled();
            }
        });
    };

    const loading = (message, onFulfilled) => {
        messageApi.open({
            type: "loading",
            content: message,
            duration: 0
        }).then(() => {
            if (onFulfilled) {
                onFulfilled();
            }
        });
        return messageApi.destroy;
    };

    return {
        messageApi: messageApi,
        contextHolder: contextHolder,
        error: error,
        success: success,
        loading: loading
    };
}

export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function downloadObjectAsJson(exportObj, exportName) {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj, null, 2));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

export function downloadObjectAsCsv(exportArr, exportName) {
    const csv = Object.keys(exportArr[0]).join(",") + "\n" +
        exportArr.map(row => Object.values(row).join(",")).join("\n");
    const dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".csv");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}