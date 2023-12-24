import { ChannelEvents } from "@/app/types";
import styles from "./styles.module.css";
import { findCurrentEvent, findDurationToNow } from "@/app/model";
import { GuideEvent } from "./guide-event";
import { NowLine } from "./now-line";
import { ForwardedRef, forwardRef } from "react";

type Props = {
  readonly row: ChannelEvents;
  readonly rowIdx: number;
  readonly firstEventStart: number;
};
const getWidth = (duration: number) => duration / 10;

export const GuideRow = forwardRef(
  (
    { row, rowIdx, firstEventStart }: Props,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
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

          const now =
            ev.startTime === nowStartTime ? (
              <NowLine left={getWidth(findDurationToNow(row.event?.[0]))} />
            ) : undefined;
          return rowIdx === 0 ? (
            <div key={ev.evtId}>
              <GuideEvent
                key={ev.evtId}
                ref={ev.startTime === nowStartTime ? ref : undefined}
                channelEvent={ev}
                width={width}
                left={left - width}
                isTitle={rowIdx === 0}
              ></GuideEvent>
              {now}
            </div>
          ) : (
            <GuideEvent
              key={ev.evtId}
              channelEvent={ev}
              width={width}
              left={left - width}
              isTitle={rowIdx === 0}
            ></GuideEvent>
          );
        })}
      </div>
    );
  }
);
