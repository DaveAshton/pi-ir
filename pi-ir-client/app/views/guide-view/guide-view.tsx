import { getChannels, getGuideEvents } from "@/app/api";

import { useState, useEffect, useRef } from "react";
import styles from "./styles.module.css";
import { Channel, ChannelEvents } from "@/app/types";
import { GuideEvent } from "./guide-event";
import {
  createClockTimeEvents,
  findCurrentEvent,
  findDurationToNow,
} from "@/app/model";
import { Title } from "./title";
import { GuideRow } from "./guide-row";

export const GuideView = () => {
  const [guideEvents, setGuideEvents] = useState<Map<number, ChannelEvents>>(
    new Map()
  );
  const [channels, setChannels] = useState<ReadonlyArray<Channel>>([]);
  const [firstEventStart, setFirstEventStart] = useState<number>(0);
  useEffect(() => {
    getGuideEvents([560, 700]).then((events) => {
      const evs = events?.filter(
        (item) => Array.isArray(item?.event) && item.event?.length > 0
      );

      const earliestStart = Math.min(
        ...evs?.map((row) => row.event[0].startTime)
      );
      const timeEvents = createClockTimeEvents(earliestStart);
      setGuideEvents(
        new Map([timeEvents, ...evs].map((e) => [e.channelid, e]))
      );
      setFirstEventStart(earliestStart); // set an event to calc position from
    });
  }, []);

  useEffect(() => {
    getChannels().then((channels) =>
      setChannels([{ channelid: 1 }, ...channels])
    );
  }, []);

  const currentTimeRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => currentTimeRef.current?.scrollIntoView({
    behavior: "smooth",
    block: "start",
    inline: "start",
  }), [guideEvents]);

  const eventRows = channels?.map((ch, rowIdx) => {
    const row = guideEvents.get(ch.channelid);
    return  row && <GuideRow key={row.channelid} firstEventStart={firstEventStart} row={row} rowIdx={rowIdx} ref={currentTimeRef} />
  });

  return (
    <div className={styles.guide}>
      <div className={styles.channelContainer}>
        {channels?.map((channel) => (
          <Title key={channel.channelid} title={channel.channelname} />
        ))}
      </div>
      <div className={styles.container}>{eventRows}</div>
    </div>
  );
};
