import { getChannels, getGuideEvents } from "@/app/api";

import { useState, useEffect, CSSProperties } from "react";
import styles from "./styles.module.css";
import { Channel, ChannelEvent, ChannelEvents } from "@/app/types";
import { GuideEvent } from "./guide-event";
import { createClockTimeEvents } from "@/app/model";
import { Title } from "./title";

const getWidth = (duration: number) => duration / 10;

const getLineStyle = (props: NowLineProps): CSSProperties => ({
  left: `${props.left}px`,
});
type NowLineProps = {
  readonly left: number;
};
const NowLine = ({ left }: NowLineProps) => {
  return <div className={styles.nowLine} style={getLineStyle({ left })}></div>;
};
export const GuideView = () => {
  const [guideEvents, setGuideEvents] = useState<ReadonlyMap<number, ChannelEvents>>(
    new Map()
  );
  const [channels, setChannels] = useState<ReadonlyArray<Channel>>([]);
  const [firstEventStart, setFirstEventStart] = useState<number>(0);
  useEffect(() => {
    getGuideEvents([560, 700]).then((events) => {
      const evs = events?.filter(
        (item) => Array.isArray(item?.event) && item.event?.length > 0
      );

      const earliestStart = Math.min(...evs?.map((row) => row.event[0].startTime));
      const timeEvents = createClockTimeEvents(earliestStart);
      setGuideEvents(new Map([timeEvents, ...evs].map(e => ([e.channelid, e]))));
      setFirstEventStart(earliestStart); // set an event to calc position from
    });
  }, []);

  useEffect(() => {
    getChannels().then((channels) => setChannels([{channelid: 1}, ...channels]));
  }, []);

  const eventRows = channels?.map((ch, idx) => {
    const row = guideEvents.get(ch.channelid);
    if (!row) {
      return undefined;
    }
    let left =
      row.event[0].startTime === firstEventStart
        ? 10
        : 10 + getWidth(row.event[0].startTime - firstEventStart);
    return (
      <div key={row.channelid} className={styles.guideRow}>
        {row.event?.map((ev) => {
          const width = getWidth(ev.duration);
          left = width + left;
          const now = <NowLine left={800} />;
          const evComp = (
            <GuideEvent
              key={ev.evtId}
              channelEvent={ev}
              width={width}
              left={left - width}
              isTitle={idx === 0}
            ></GuideEvent>
          );
          return idx === 0 ? (
            <div key={ev.evtId}>
              {evComp}
              {now}
            </div>
          ) : (
            evComp
          );
        })}
      </div>
    );
  });
  return (
    <div className={styles.guide}>
      <div className={styles.channelContainer}>
        {channels?.map((channel) => (
          <Title key={channel.channelid} title={channel.channelname} />
        ))}
      </div>
      <div className={styles.container}>
        {eventRows}
        </div>
    </div>
  );
};
