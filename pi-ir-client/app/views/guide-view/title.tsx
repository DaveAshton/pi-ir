import { CSSProperties } from "react";
import { Card, Spinner } from "react-bootstrap";
import styles from "./styles.module.css";
type Props = {
  readonly title?: string;
  readonly isBusy?: boolean;
};
const getStyle = (): CSSProperties => ({
  height: "78px",
  width: "120px",
  overflow: "hidden",
  marginTop: "1px",
});
export const Title = ({ title, isBusy }: Props) => {
  return (
    <Card style={getStyle()} title={title} bg="secondary" text="white">
      <Card.Body>
        <Card.Title title={title} className="h6 text-white" style={{display: "flex"}}>
          <div>{title}</div>
          {isBusy ? <Spinner animation="border" size="sm" /> : undefined}
        </Card.Title>
      </Card.Body>
    </Card>
  );
};
