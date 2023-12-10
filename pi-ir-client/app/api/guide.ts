import { ChannelEvents } from "../types";

// const baseUrl = "https://www.freesat.co.uk/tv-guide/api/0?channel=712";
const baseUrl = `${process.env.serverUrl}/guide`;
export const getGuideEvents = (
  channelIds: ReadonlyArray<number>
): Promise<ReadonlyArray<ChannelEvents>> => {
 // const qry = channelIds.map((id) => encodeURIComponent(`&channel=${id}`));
  const search = baseUrl ;
  console.log(">> about to get guide events to", search);
  return fetch(search).then((response) => {
    console.log(">> guide received", response)
      return response?.json();
  }).catch(err => console.error("error getting guide", err));
};
