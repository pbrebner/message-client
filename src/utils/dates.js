import { DateTime } from "luxon";

function formatDate(date) {
    const formattedDate = DateTime.fromISO(date).toLocaleString();
    return formattedDate;
}

function formatDateLong(date) {
    const formattedDate = DateTime.fromISO(date).toLocaleString(
        DateTime.DATE_FULL
    );
    return formattedDate;
}

function formatDateTime(date) {
    const formattedDate = DateTime.fromISO(date).toLocaleString({
        ...DateTime.DATETIME_SHORT,
        hourCycle: "h12",
    });
    return formattedDate;
}

export { formatDate, formatDateLong, formatDateTime };
