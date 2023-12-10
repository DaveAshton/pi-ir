import {DateTime} from "luxon";
export const toTimeFormat = (ms: number) => {
    return DateTime.fromMillis(ms *1000).toFormat("HH:mm")
}

export const getNow = () => {
    return Date.now()
}

export const getDurationFromMidnight = () => {
    return Date.now() - DateTime.now().startOf('day').toJSDate().getTime();
}