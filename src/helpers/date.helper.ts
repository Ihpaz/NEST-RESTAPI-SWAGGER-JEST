import * as moment from 'moment-timezone';
import { parseLatLong } from './latlong.helper';

export const dateMoment = (dateRaw: string = null, latLong: string = null) => {
    let result: moment.Moment = null;
    if (!latLong) {
        result = dateRaw ? moment(new Date(dateRaw)) : moment();
    } else {
        const latLongTz = parseLatLong(latLong);
        result = dateRaw ? moment(new Date(dateRaw)).tz(latLongTz.timezone) : moment().tz(latLongTz.timezone);
    }

    return result;
};

export const dateMomentUtc = (dateRaw: string = null, utc: boolean = true) => {
    let result: moment.Moment = dateRaw ? moment(new Date(dateRaw)) : moment();
    return result.utc(utc);
};

export const dateNumbToDate = (numbDate: number) => {
    const numbValue = Math.floor(numbDate - 25569) * 86400,
        dateInfo = new Date(numbValue * 1000),
        month = parseInt(dateInfo.getMonth().toString()) + 1,
        day = dateInfo.getDate();

    const sMonth = month.toString().length === 1 ? `0${month.toString()}` : month.toString(),
        sDay = day.toString().length === 1 ? `0${day.toString()}` : day.toString();

    const newDate = dateInfo.getFullYear() + '/' + sMonth + '/' + sDay;
    return newDate;
}

export const dateMonthRomawi = (dateRaw: string = null) => {
    const romawi = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    const result = dateRaw ? moment(new Date(dateRaw)) : moment();
    return romawi[result.month()];
}
