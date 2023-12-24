import { getChannels, getGuideEvents } from "@/app/api";

import { useState, useEffect, CSSProperties, useRef } from "react";
import styles from "./styles.module.css";
import { Channel, ChannelEvent, ChannelEvents } from "@/app/types";
import { GuideEvent } from "./guide-event";
import { createClockTimeEvents, findCurrentEvent } from "@/app/model";
import { Title } from "./title";
import { Button } from "react-bootstrap";

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
  const paragraphRef = useRef<null | HTMLDivElement>(null);
  useEffect(() => {
    console.log(">> scrolling to ", paragraphRef.current);
    return paragraphRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "start",
    });
  }, [guideEvents]);

  const eventRows = channels?.map((ch, rowIdx) => {
    const row = guideEvents.get(ch.channelid);
    if (!row) {
      return undefined;
    }
    let nowStartTime: number | undefined;
    if (rowIdx === 0) {
      nowStartTime = findCurrentEvent(row.event)?.startTime;
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

          return rowIdx === 0 ? (
            <div
              key={ev.evtId}
            >
             <GuideEvent
              key={ev.evtId}
              ref={ev.startTime === nowStartTime ? paragraphRef : undefined}
              channelEvent={ev}
              width={width}
              left={left - width}
              isTitle={rowIdx === 0}
            ></GuideEvent>
              <NowLine left={800} />
            </div>
          ) : 
          <GuideEvent
          key={ev.evtId}
          channelEvent={ev}
          width={width}
          left={left - width}
          isTitle={rowIdx === 0}
        ></GuideEvent>
        ;
        })}
      </div>
    );
  });
  return (
    <div className={styles.guide}>
         <Button
 
      variant="secondary"
      onClick={() => {
        console.log(">> btn scrolling to ", paragraphRef.current);
       
        return paragraphRef.current?.scrollIntoView({
          behavior: "smooth",
          //   block: "start",
          //  block: "nearest",
          inline: "start",
        });
      }}
    >
      scroll
    </Button>
      <div className={styles.channelContainer}>
        {channels?.map((channel) => (
          <Title key={channel.channelid} title={channel.channelname} />
        ))}
      </div>
      <div className={styles.container}>{eventRows}</div>
    </div>
  );
};
