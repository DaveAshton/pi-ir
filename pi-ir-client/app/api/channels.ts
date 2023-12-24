import { Channel } from "../types";

const baseUrl = `${process.env.serverUrl}/channels`;
export const changeChannel = (channel?: string | number) => {
  console.log(">> channel", channel);
  if (channel) {
    const url = `${baseUrl}/${channel}`;
    console.log(">> about to send to", url);
    return fetch(url)
      .then((res) => console.log(">> response", res))
      .catch((err) => console.error("error sending channel", err));
  }
};

export const getChannels = (): Promise<ReadonlyArray<Channel>> => {
   // console.log(">> about to get channels to", baseUrl);
    return fetch(baseUrl).then(response => response.json());
};