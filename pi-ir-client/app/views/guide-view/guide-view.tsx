import { getChannels, getGuideEvents } from "@/app/api";

import { useState, useEffect, CSSProperties } from "react";
import styles from "./styles.module.css";
import { ChannelEvent, ChannelEvents } from "@/app/types";
import { GuideEvent } from "./guide-event";

const getWidth = (duration: number) => duration / 10;

const getLineStyle = (props: NowLineProps): CSSProperties => ({
  left: `${props.left}px`,
  // position: "absolute",
});
type NowLineProps = {
  readonly left: number;
};
const NowLine = ({ left }: NowLineProps) => {
  return <div className={styles.nowLine} style={getLineStyle({ left })}></div>;
};
export const GuideView = () => {
  const [guideEvents, setGuideEvents] = useState<ReadonlyArray<ChannelEvents>>(
    []
  );
  const [firstEventStart, setFirstEventStart] = useState<number>(0);
  useEffect(() => {
    getGuideEvents([712, 710]).then((events) => {
      console.log(">> guideEvents", events);
      const evs = events?.filter((item) => Array.isArray(item?.event));
      setGuideEvents(evs);
      const earliestStart = Math.min(
        ...evs.map((row) => row.event[0].startTime)
      );
      setFirstEventStart(earliestStart); // set an event to calc position from
    });
  }, []);

  const eventitems = guideEvents?.map((row, idx) => {
    // let left = 10
    let left =
      row.event[0].startTime === firstEventStart
        ? 10
        : 10 + getWidth(row.event[0].startTime - firstEventStart);
    return (
      <div key={row.channelid} className={styles.guideRow}>
        {row.event?.map((ev) => {
          const width = getWidth(ev.duration);
          left = width + left + 2; // naughty
          return (
            <GuideEvent
              key={ev.evtId}
              channelEvent={ev}
              width={width}
              left={left - width}
            ></GuideEvent>
          );
        })}
      </div>
    );
  });
  return (
    <div className={styles.container}>
      <div className={styles.guideRow}>
        <NowLine left={800} />
      </div>
      {eventitems}
    </div>
  );
};
