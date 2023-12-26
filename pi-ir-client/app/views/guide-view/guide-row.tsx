import { ChannelEvents } from "@/app/types";
import styles from "./styles.module.css";
import { findCurrentEvent, findDurationToNow } from "@/app/model";
import { GuideEvent } from "./guide-event";
import { NowLine } from "./now-line";
import { ForwardedRef, forwardRef } from "react";

type Props = {
  readonly row: ChannelEvents;
  readonly firstEventStart: number;
  readonly isHeaderRow: boolean;
  readonly nowStartTime?: number;
};
const getWidth = (duration: number) => duration / 10;

export const GuideRow = forwardRef(
  (
    { row, firstEventStart, isHeaderRow, nowStartTime }: Props,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    
    let left =
      row.event[0]?.startTime === firstEventStart
        ? 10
        : 10 + getWidth(row.event[0]?.startTime - firstEventStart);

    return (
      <div key={row.channelid} className={styles.guideRow}>
        {row.event?.map((ev) => {
          const width = getWidth(ev.duration);
          left = width + left;

          const addNow = isHeaderRow && ev.startTime === nowStartTime;
          if (addNow) {
            console.log(">> adding now", ev, (row.event?.[0]))
          }
          const now = addNow ? (
            <NowLine left={getWidth(findDurationToNow(row.event?.[0]))} />
          ) : undefined;

          return isHeaderRow ? (
            <div key={ev.evtId}>
              <GuideEvent
                key={ev.evtId}
                ref={addNow ? ref : undefined}
                channelEvent={ev}
                width={width}
                left={left - width}
                isTitle={isHeaderRow}
              ></GuideEvent>
              {now}
            </div>
          ) : (
            <GuideEvent
              key={ev.evtId}
              channelEvent={ev}
              width={width}
              left={left - width}
              isTitle={isHeaderRow}
            ></GuideEvent>
          );
        })}
      </div>
    );
  }
);
