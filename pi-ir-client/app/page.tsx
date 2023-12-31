"use client";
import Image from "next/image";
import Input from "./components/input";
import { ChannelsView, GuideView } from "./views";
import styles from "./page.module.css";
import { changeChannel } from "./api";
import "bootstrap/dist/css/bootstrap.min.css";
import { Accordion } from "react-bootstrap";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col justify-center items-center  ">
      <div className="flex w-full  justify-center mt-6 font-mono text-sm lg:flex w-1/2">
        <p className="flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Telly Controller&nbsp;
          <code className="font-mono font-bold">
            using: {process.env.serverUrl}
          </code>
        </p>
      </div>
      <div className={styles.container}>
        <Input
          buttonLabel="Send"
          label="Enter channel"
          type="number"
          click={changeChannel}
        />
        <Accordion className={styles.accordion} defaultActiveKey="1">
          <Accordion.Item eventKey="0" defaultChecked={false}>
            <Accordion.Header>Channels</Accordion.Header>
            <Accordion.Body>
              <ChannelsView onChangeChannel={changeChannel} />
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1" defaultChecked={true}>
            <Accordion.Header>Guide</Accordion.Header>
            <Accordion.Body>
              <GuideView />
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[400px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]"></div>
      {/* <iframe
        src="https://www.tvguide.co.uk/"
        className="flex w-full p-5 min-h-screen flex-col items-center"
      /> */}
    </main>
  );
}
