import { CSSProperties } from "react";
import { Card, Spinner } from "react-bootstrap";
import styles from "./styles.module.css";
type Props = {
  readonly channel?: number;
  readonly onClick: (channel?: number) => void;
  readonly title?: string;
  readonly isBusy?: boolean;
};
const getStyle = (): CSSProperties => ({
  height: "78px",
  width: "120px",
  overflow: "hidden",
  marginTop: "1px",
});
export const Title = ({ channel, title, isBusy, onClick }: Props) => {
  return (
    <Card
      style={getStyle()}
      className={styles.titleContainer}
      title={title}
      bg="secondary"
      text="white"
      onClick={() => onClick(channel)}
    >
      <Card.Body>
        <Card.Title
          title={title}
          className="h6 text-white"
          style={{ display: "flex" }}
        >
          <div>{title}</div>
          {isBusy ? <Spinner animation="border" size="sm" /> : undefined}
        </Card.Title>
      </Card.Body>
    </Card>
  );
};
