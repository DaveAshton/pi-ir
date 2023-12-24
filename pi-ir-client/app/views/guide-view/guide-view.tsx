import { getChannels, getGuideEvents } from "@/app/api";

import { useState, useEffect, useRef, UIEventHandler } from "react";
import styles from "./styles.module.css";
import { Channel, ChannelEvents } from "@/app/types";
import { createClockTimeEvents, debounce, findCurrentEvent } from "@/app/model";
import { Title } from "./title";
import { GuideRow } from "./guide-row";

export const GuideView = () => {
  const [guideEvents, setGuideEvents] = useState<Map<number, ChannelEvents>>(
    new Map()
  );
  const [channels, setChannels] = useState<ReadonlyArray<Channel>>([]);
  const [firstEventStart, setFirstEventStart] = useState<number>(0);
  const [scrollEnd, setScrollEnd] = useState<number>(20 * 80);
  const [hasScrolled, setHasScrolled] = useState(false);
  useEffect(() => {
    if (channels?.length > 0) {
      const channelCount = Math.round(scrollEnd / 70);
      const ids = channels
        .slice(0, channelCount)
        .filter(ch =>!guideEvents.has( ch.channelid))
        .map((ch) =>ch.channelid )
      getGuideEvents(ids).then(
        (events) => {
          if (!Array.isArray(events)) {
            return;
          }
          const evs = events?.filter(
            (item) => Array.isArray(item?.event) && item.event?.length > 0
          );

          const earliestStart = Math.min(
            ...evs?.map((row) => row.event[0].startTime)
          );
          const timeEvents = createClockTimeEvents(earliestStart);
          setGuideEvents( 
            curr => {
              if (curr.size === 0) {
                curr.set(1, timeEvents)
              } 
              evs.forEach(val => curr.set(val.channelid, val));
              return new Map( curr);
            }
          );
          setFirstEventStart(earliestStart); // set an event to calc position from
        }
      );
    }
  }, [channels, scrollEnd]);

  useEffect(() => {
    getChannels().then(
      (channels) => setChannels([...channels])
    );
  }, []);

  const currentTimeRef = useRef<null | HTMLDivElement>(null);

  useEffect(
    () => {
      if (currentTimeRef.current && !hasScrolled) {
        currentTimeRef.current?.scrollIntoView(scrollBehaviour);
        setHasScrolled(true);
      }
    },
    [guideEvents]
  );

  const handleScroll: UIEventHandler<HTMLDivElement> = debounce(300, (ev) => {
    const target = ev?.target as HTMLDivElement;
  //  console.log(">> scrollTop", target?.scrollTop);
    if (target?.scrollTop > scrollEnd ) {
      setScrollEnd(target?.scrollTop);
    }

  });

  console.log(">> guide vals", guideEvents)
  const eventRows = channels?.map((ch, rowIdx) => {
    const row = guideEvents.get(ch.channelid);

    let nowStartTime =
      row && rowIdx === 0 ? findCurrentEvent(row.event)?.startTime : undefined;

    return (
      row && (
        <GuideRow
          key={row.channelid}
          firstEventStart={firstEventStart}
          row={row}
          ref={currentTimeRef}
          isHeaderRow={rowIdx === 0}
          nowStartTime={nowStartTime}
        />
      )
    );
  });
  const headerRow = guideEvents.get(1);
  let nowStartTime = headerRow
    ? findCurrentEvent(headerRow.event)?.startTime
    : undefined;

  return (
    <div className={styles.guide} onScroll={handleScroll}>
      <div className={styles.channelContainer}>
        {channels?.map((channel) => (
          <Title key={channel.channelid} title={channel.channelname} />
        ))}
      </div>

      <div className={styles.container}>
        <div className={styles.header}>
          {headerRow ? (
            <GuideRow
              key={headerRow?.channelid}
              firstEventStart={firstEventStart}
              row={headerRow}
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
  block: 'end'
};
