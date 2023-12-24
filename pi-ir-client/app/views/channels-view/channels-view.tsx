import Accordion from "react-bootstrap/Accordion";
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
  return (
    <Accordion className={styles.accordion} >
      <Accordion.Item eventKey="0" defaultChecked={false}>
        <Accordion.Header>Channels</Accordion.Header>
        <Accordion.Body>{channelButtons}</Accordion.Body>
      </Accordion.Item>
      {/* <Accordion.Item eventKey="1">
        <Accordion.Header>All channels</Accordion.Header>
        <Accordion.Body>{channelButtons}</Accordion.Body>
      </Accordion.Item> */}
      {/* <Accordion.Item eventKey="2">
        <Accordion.Header>Guide</Accordion.Header>
        <Accordion.Body>
          <iframe
            src="https://www.tvguide.co.uk/"
            className="flex w-full p-5 min-h-screen flex-col items-center"
          />
        </Accordion.Body>
      </Accordion.Item> */}
    </Accordion>
  );
};
