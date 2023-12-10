import { Channel } from "../types";

export const changeChannel = (channel?: string | number) => {
  console.log(">> channel", channel);
  if (channel) {
    const url = `${process.env.serverUrl}/channels/${channel}`;
    console.log(">> about to send to", url);
    return fetch(url)
      .then((res) => console.log(">> response", res))
      .catch((err) => console.error("error sending channel", err));
  }
};

export const getChannels = (): Promise<ReadonlyArray<Channel>> => {
    const url = `${process.env.serverUrl}/channels`;
    console.log(">> about to get channels to", url);
    return fetch(url).then(response => response.json());
};