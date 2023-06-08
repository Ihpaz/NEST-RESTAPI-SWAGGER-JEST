import * as geoTz from 'geo-tz';
import {find} from 'geo-tz';

export const parseLatLong = (latLong: string) => {
    try {
        const splitLatlong = latLong.split(','),
            latitude = splitLatlong[0],
            longitude = splitLatlong[1];

        const parseLat = parseFloat(latitude).toFixed(7),
            parseLong = parseFloat(longitude).toFixed(7);

        const timezone = find(parseFloat(parseLat), parseFloat(parseLong));

        return {
            latitude: parseLat,
            longitude: parseLong,
            timezone: timezone[0],
        };
    } catch (error) {
        throw new Error(error.message);
    }
};
