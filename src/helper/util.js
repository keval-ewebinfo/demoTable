import { useCallback } from 'react';

export const convertHours = (time) => {
    let split = time.split(':');
    let hours = split && split[0] ? Number(split[0]) : 0;
    let hoursToMin = hours * 60;
    let min = split && split[1] ? Number(split[1]) : 0;
    return hoursToMin + min;
};
