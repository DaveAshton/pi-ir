import { Channel, ChannelEvents } from "@/app/types";
import styles from "./styles.module.css";
import { debounce } from "@/app/model";
import { UIEventHandler, useEffect, useRef, useState } from "react";
import { GuideRow } from "./guide-row";
import { Title } from "./title";
import { changeChannel } from "@/app/api";

type Props = {
  readonly guideEvents: Map<number, ChannelEvents>;
  readonly channels: ReadonlyArray<Channel>;
  readonly fetchingChannels: Set<number>;
  readonly firstEventStart: number;
  readonly nowStartTime?: number;
  readonly headerEvents?: ChannelEvents;
  readonly onScrollY: (scrollTop: number) => void;
};

export const GuideList = ({
  firstEventStart,
  channels,
  fetchingChannels,
  guideEvents,
  onScrollY,
  headerEvents,
  nowStartTime,
}: Props) => {
  const handleScroll: UIEventHandler<HTMLDivElement> = debounce(300, (ev) => {
    onScrollY(ev?.target?.scrollTop);
  });
  const [hasScrolled, setHasScrolled] = useState(false);
  const currentTimeRef = useRef<null | HTMLDivElement>(null);
  useEffect(() => {
    if (currentTimeRef.current && !hasScrolled) {
      currentTimeRef.current?.scrollIntoView(scrollBehaviour);
      setHasScrolled(true);
    }
  }, [guideEvents]);

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
  return (
    <div className={styles.guide} onScroll={handleScroll}>
      <div className={styles.channelContainer}>
        {channels?.map((channel) => (
          <Title
            key={channel.channelid}
            channel={channel.lcn}
            title={channel.channelname}
            isBusy={fetchingChannels.has(channel.channelid)}
            onClick={changeChannel}
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
