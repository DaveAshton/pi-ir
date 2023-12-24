import { ChannelEvent } from "@/app/types";
import Card from 'react-bootstrap/Card';
import styles from "./styles.module.css";
import { CSSProperties, ForwardedRef, forwardRef } from "react";
import { toTimeFormat } from "@/app/model";
type Props = {
  readonly channelEvent: ChannelEvent;
  readonly left: number;
  readonly width: number;
  readonly isTitle?: boolean;
};

// a little clunky, but we have absolute positions becuase of an infinite horizontal scroll
const getStyle = (props: Props): CSSProperties => ({
  width: `${props.width}px`,
  left: `${props.left}px`,
  position: "absolute",
  height: "78px",
  overflow: "hidden"
});
const getTitleStyle = (props: Props) => ({
    textOverflow: "ellipsis",
    textWrap: "nowrap",
    width: `${props.width - 20}px`,
    overflow: "hidden"
})
export const GuideEvent = forwardRef((props: Props, ref: ForwardedRef<HTMLDivElement>) => {
  const bg = props.isTitle ? "secondary" : "dark";
  return (
    <Card ref={ref} style={getStyle(props)} title={props.channelEvent.name} bg={bg} text="white">
    <Card.Body>
      <Card.Title title={props.channelEvent.description} className="h6 text-white"  >
        <div style={getTitleStyle(props)}>{props.channelEvent.name}</div>
        </Card.Title>
      <Card.Text>
      {toTimeFormat(props.channelEvent.startTime)}
      </Card.Text>
    </Card.Body>
  </Card>
  );
});
