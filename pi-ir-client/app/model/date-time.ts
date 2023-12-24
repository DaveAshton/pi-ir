import {DateTime} from "luxon";
import { ChannelEvent, ChannelEvents } from "../types";
export const toTimeFormat = (ms: number) => {
    return toDateTime(ms).toFormat("HH:mm")
}

export const getNow = () => {
    return Date.now()
}

// export const getDurationFromMidnight = () => {
//     return Date.now() - DateTime.now().startOf('day').toJSDate().getTime();
// }

export const createClockTimeEvents = (startMillis: number): ChannelEvents => {
    const start = toDateTime(startMillis).startOf("hour").minus({hours: 1});
    const end = start.plus({hours: 24});

    let now = start;
    let result: ChannelEvent[] = []
    while(now < end) {
        now = now.plus({hours: 1});
         result.push({
            description: now.toFormat("HH:mm"),
            duration: 60*60,
            name: now.toFormat("HH:mm"),
            startTime: now.toMillis() / 1000,
            evtId: now.toMillis()
         })
    }
    return {
        channelid: 1,
        event: result,
        offset: 0
    };
}

export const findCurrentEvent = (events: ReadonlyArray<ChannelEvent>) => {
    const now = DateTime.now().toMillis() / 1000;
    return events.find((ev, idx) => idx +1 < events.length && ev.startTime <= now && events[idx +1].startTime > now );
};

const toDateTime = (millis: number) => DateTime.fromMillis(millis *1000);