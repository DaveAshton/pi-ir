import { Channel, ChannelEvents } from "../types";

export function getChannelIdsTofetch(
    scrollEnd: number,
    channels: readonly Channel[],
    guideEvents: Map<number, ChannelEvents>,
    fetchingChannels: Set<number>,
    rowHeightApprox = 70
  ) {
    const channelCount = Math.round(scrollEnd / rowHeightApprox);
    const ids = channels
      .slice(0, channelCount)
      .filter(
        (ch) =>
          !guideEvents.has(ch.channelid) && !fetchingChannels.has(ch.channelid)
      )
      .map((ch) => ch.channelid);

      console.log(">> ids to fetch", ids, fetchingChannels, guideEvents)
    return ids;
  }
  
  