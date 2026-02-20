import moment from "moment";

// it function says the date is today or yesterday or other day

function getingDate(jsDate, wantDate = false) {
    const momentDate = moment(jsDate); // Convert the JS Date object to a Moment object
    const now = moment();
    const yesterday = moment().subtract(1, 'day');

    if (momentDate.isSame(now, 'day')) {
        return "Today";
    } else if (momentDate.isSame(yesterday, 'day')) {
        return "Yesterday";
    } else if (!momentDate.isSame(now, 'year')) { // Corrected logic to check if the date is not in the current year
        if (wantDate) {
        return momentDate.format('DD-MMM-YYYY');
        } else {
        return momentDate.format('MMM-YY');
        }
    } else {
        // Corrected with explicit return and improved clarity
        if (momentDate.isSame(now, 'week')) {
            return momentDate.format('dddd');
        } else {
            return momentDate.format('DD-MMM');
        }
    }
}


export default getingDate;