export type Channel = {
  readonly channeldescription: string;
  readonly channelid: number;
  readonly channelname: string;
  readonly lcn: number;
  readonly logourl: string;
  readonly tstv: boolean;
};

export type ChannelEvent = {
  readonly description: string;
  readonly duration: number;
  readonly evtId: number;
  readonly hasTstv: boolean;
  readonly image: string;
  readonly name: string;
  readonly startTime: number;
  readonly svcId: number;
};

export type ChannelEvents = {
  readonly channelid: number;
  readonly offset: number;
  readonly event: ReadonlyArray<ChannelEvent>;
};
