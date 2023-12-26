
import { ChannelEvents } from "../types";

// const baseUrl = "https://www.freesat.co.uk/tv-guide/api/0?channel=712";
const baseUrl = `${process.env.serverUrl}/guide?`;
export const getGuideEvents = (
  channelIds: ReadonlyArray<number>,
  current: Map<number, ChannelEvents>
): Promise<Map<number, ChannelEvents>> => {
  const qry = channelIds.map((id) => `&channel=${id}`).join("");
  const search = baseUrl + qry;
  console.log(">> about to get guide events:", search);
  return fetch(search)
    .then((response) => {
      return response?.json().then(
        events => toMap(events, current)
      );
    })
    .catch((err) => {
       console.error("error getting guide", err);
       return Promise.resolve( new Map<number, ChannelEvents>());
    });
};

const toMap = (
  events: ReadonlyArray<ChannelEvents>,
  current: Map<number, ChannelEvents>
) => {
  if (!Array.isArray(events)) {
    return Promise.resolve( new Map<number, ChannelEvents>());
  }
  const evs: ReadonlyArray<ChannelEvents> = events?.filter(
    (item) => Array.isArray(item?.event) && item.event?.length > 0
  );

  // const earliestStart = startOfDay()
 
  evs.forEach((val) => current.set(val.channelid, val));

  return Promise.resolve(new Map(current));
};
