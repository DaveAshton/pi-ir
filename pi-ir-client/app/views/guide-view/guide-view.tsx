import { getChannels, getGuideEvents } from "@/app/api";

import { useState, useEffect, useRef, UIEventHandler } from "react";
import styles from "./styles.module.css";
import { Channel, ChannelEvents } from "@/app/types";
import { createClockTimeEvents, debounce, findCurrentEvent, startOfDay } from "@/app/model";
import { Title } from "./title";
import { GuideRow } from "./guide-row";

export const GuideView = () => {
  const [guideEvents, setGuideEvents] = useState<Map<number, ChannelEvents>>(
    new Map()
  );
  const [headerEvents, setHeaderEvents] = useState<ChannelEvents | undefined>(
  undefined
  );
  const [channels, setChannels] = useState<ReadonlyArray<Channel>>([]);
  const [firstEventStart, setFirstEventStart] = useState<number>(0);
  const [scrollEnd, setScrollEnd] = useState<number>(20 * 80);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [fetchingChannels, setFetchingChannels] = useState<Set<number>>(
    new Set()
  );

  useEffect(() => {
    if (channels?.length > 0) {
      const channelCount = Math.round(scrollEnd / 70);
      const ids = channels
        .slice(0, channelCount)
        .filter((ch) => !guideEvents.has(ch.channelid) && !fetchingChannels.has(ch.channelid))
        .map((ch) => ch.channelid);
      setFetchingChannels(new Set(ids));
    }
  }, [channels, scrollEnd]);

  useEffect(() => {
    const earliestStart = startOfDay();
      setHeaderEvents(createClockTimeEvents(earliestStart));
      setFirstEventStart(earliestStart);
  }, [guideEvents]);

  useEffect(() => {
    if (fetchingChannels?.size > 0) {
      getGuideEvents( Array.from(fetchingChannels.values()), guideEvents).then((events) => {
        setGuideEvents(events);
        setFetchingChannels((curr) => new Set(
          Array.from(curr.values()).filter(channelId => !events.has(channelId))
        ));
      });
    }
  }, [fetchingChannels]);

  useEffect(() => {
    getChannels().then((channels) => setChannels([...channels]));
  }, []);

  const currentTimeRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (currentTimeRef.current && !hasScrolled) {
      currentTimeRef.current?.scrollIntoView(scrollBehaviour);
      setHasScrolled(true);
    }
  }, [guideEvents]);

  const handleScroll: UIEventHandler<HTMLDivElement> = debounce(300, (ev) => {
    const target = ev?.target as HTMLDivElement;
    //  console.log(">> scrollTop", target?.scrollTop);
    if (target?.scrollTop > scrollEnd) {
      setScrollEnd(target?.scrollTop);
    }
  });

  const eventRows = channels?.map((ch) => {
    const row = guideEvents.get(ch.channelid);
    return (
      row && (
        <GuideRow
          key={row.channelid}
          firstEventStart={firstEventStart}
          row={row}
          ref={currentTimeRef}
          isHeaderRow={false}
        />
      )
    );
  });

  let nowStartTime = headerEvents
    ? findCurrentEvent(headerEvents.event)?.startTime
    : undefined;

  return (
    <div className={styles.guide} onScroll={handleScroll}>
      <div className={styles.channelContainer}>
        {channels?.map((channel) => (
          <Title
            key={channel.channelid}
            title={channel.channelname}
            isBusy={fetchingChannels.has(channel.channelid)}
          />
        ))}
      </div>

      <div className={styles.container}>
        <div className={styles.header}>
          {headerEvents ? (
            <GuideRow
              key={headerEvents?.channelid}
              firstEventStart={firstEventStart}
              row={headerEvents}
              ref={currentTimeRef}
              isHeaderRow={true}
              nowStartTime={nowStartTime}
            />
          ) : undefined}
        </div>
        {eventRows}
      </div>
    </div>
  );
};

const scrollBehaviour: ScrollIntoViewOptions = {
  behavior: "smooth",
  inline: "center",
  block: "end",
};
