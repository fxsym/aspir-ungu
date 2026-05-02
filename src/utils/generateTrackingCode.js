import { getLastTrackingCodeByDate } from "@/services/aspiration.services";

export function formatDateDDMMYYYY(date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}${month}${year}`;
}

export function padSequence(num) {
    return String(num).padStart(4, "0");
}

export async function generateTrackingCode() {
    const today = new Date();
    const datePrefix = formatDateDDMMYYYY(today);

    const lastData = await getLastTrackingCodeByDate(datePrefix);

    let nextNumber = 1;

    if (lastData) {
        const lastCode = lastData.tracking_code;
        const lastSequence = parseInt(lastCode.split("-")[1], 10);
        nextNumber = lastSequence + 1;
    }

    const newCode = `${datePrefix}-${padSequence(nextNumber)}`;

    return newCode;
}