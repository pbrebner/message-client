import { DateTime } from "luxon";

function formatDate(date) {
    const formattedDate = DateTime.fromISO(date).toLocaleString();
    return formattedDate;
}

export { formatDate };
