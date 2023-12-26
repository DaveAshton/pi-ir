import { getChannels, getGuideEvents } from "@/app/api";

import { useState, useEffect } from "react";
import { Channel, ChannelEvents } from "@/app/types";
import { createClockTimeEvents, findCurrentEvent, getChannelIdsTofetch, startOfDay } from "@/app/model";
import { GuideList } from "./guide-list";

export function GuideView ()  {
  const [guideEvents, setGuideEvents] = useState<Map<number, ChannelEvents>>(
    new Map()
  );
  const [headerEvents, setHeaderEvents] = useState<ChannelEvents | undefined>(
    undefined
  );
  const [channels, setChannels] = useState<ReadonlyArray<Channel>>([]);
  const [firstEventStart, setFirstEventStart] = useState<number>(0);
  const [scrollEnd, setScrollEnd] = useState<number>(20 * 80);
  const [fetchingChannels, setFetchingChannels] = useState<Set<number>>(
    new Set()
  );

  useEffect(() => {
    if (channels?.length > 0) {
      setFetchingChannels(new Set(getChannelIdsTofetch(scrollEnd, channels, guideEvents, fetchingChannels)));
    }
  }, [channels, scrollEnd]);

  useEffect(() => {
    const earliestStart = startOfDay();
    setHeaderEvents(createClockTimeEvents(earliestStart));
    setFirstEventStart(earliestStart);
  }, [guideEvents]);

  useEffect(() => {
    if (fetchingChannels?.size > 0) {
      getGuideEvents(Array.from(fetchingChannels.values()), guideEvents).then(
        (events) => {
          setGuideEvents(events);
          setFetchingChannels(
            (curr) =>
              new Set(
                Array.from(curr.values()).filter(
                  (channelId) => !events.has(channelId)
                )
              )
          );
        }
      );
    }
  }, [fetchingChannels]);

  useEffect(() => {
    getChannels().then((channels) => setChannels([...channels]));
  }, []);

  let nowStartTime = headerEvents
    ? findCurrentEvent(headerEvents.event)?.startTime
    : undefined;

  return (
    <GuideList
      channels={channels}
      guideEvents={guideEvents}
      fetchingChannels={fetchingChannels}
      firstEventStart={firstEventStart}
      headerEvents={headerEvents}
      nowStartTime={nowStartTime}
      onScrollY={setScrollEnd}
    />
  );
};