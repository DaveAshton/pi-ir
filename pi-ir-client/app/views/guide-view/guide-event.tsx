import { ChannelEvent } from "@/app/types";
import Card from "react-bootstrap/Card";
import styles from "./styles.module.css";
import { CSSProperties, ForwardedRef, forwardRef } from "react";
import { toTimeFormat } from "@/app/model";
import { OverlayTrigger, Popover } from "react-bootstrap";
import {
  OverlayDelay,
  OverlayTriggerType,
} from "react-bootstrap/esm/OverlayTrigger";
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
  overflow: "hidden",
});
const getTitleStyle = (props: Props) => ({
  textOverflow: "ellipsis",
  textWrap: "nowrap",
  width: `${props.width - 20}px`,
  overflow: "hidden",
});

export const GuideEvent = forwardRef(
  (props: Props, ref: ForwardedRef<HTMLDivElement>) => {
    const bg = props.isTitle ? "secondary" : "dark";
    const time = toTimeFormat(props.channelEvent.startTime);
    const guideDetail = (
      <Popover id="popover-basic">
        <Popover.Header as="h3">{props.channelEvent?.name} - {time}</Popover.Header>
        <Popover.Body>{props.channelEvent?.description}</Popover.Body>
      </Popover>
    );

    return (
      <Card
        ref={ref}
        style={getStyle(props)}
        bg={bg}
        text="white"
      >
        <Card.Body>
          <OverlayTrigger
            delay={delay}
            trigger={trggerTypes}
            placement="bottom"
            overlay={guideDetail}
          >
            <Card.Title
              className="h6 text-white"
            >
              <div style={getTitleStyle(props)}>{props.channelEvent.name}</div>
            </Card.Title>
          </OverlayTrigger>
          <Card.Text>{time}</Card.Text>
        </Card.Body>
      </Card>
    );
  }
);

const delay: OverlayDelay = { hide: 5, show: 0 };
const trggerTypes: OverlayTriggerType[] = ["focus", "hover"];
