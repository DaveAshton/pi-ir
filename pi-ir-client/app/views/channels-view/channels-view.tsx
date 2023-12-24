
import Button from "react-bootstrap/Button";

import styles from "./channels-view.module.css";
import { useEffect, useState } from "react";
import { getChannels } from "@/app/api";
import { Channel } from "@/app/types";

type Props = {
  onChangeChannel: (channel?: string | number) => void;
};
export const ChannelsView = ({ onChangeChannel }: Props) => {
  const [channels, setChannels] = useState<ReadonlyArray<Channel>>([]);
  useEffect(() => {
    getChannels().then((channels) => {
      return setChannels(channels);
    });
  }, []);
  const channelButtons = channels.map((channel) => (
    <Button
      className={styles.channelButton}
      key={channel.channelid}
      variant="secondary"
      onClick={() => onChangeChannel(channel.lcn)}
    >
      {channel.channelname}
    </Button>
  ));
  return channelButtons;
};
