import { CSSProperties } from "react";
import { Card } from "react-bootstrap";
import styles from "./styles.module.css";
 type Props = {
    readonly title?: string;
 }
 const getStyle = (): CSSProperties => ({

    height: "78px",
    width: "100px",
    overflow: "hidden",
    marginTop: "1px",

  });
 export const Title =({title}: Props) => {
    return (
        <Card style={getStyle()}  title={title} bg="secondary" text="white">
        <Card.Body>
          <Card.Title title={title} className="h6 text-white"  >
          <div >{title}</div>
            </Card.Title>
          <Card.Text>
          </Card.Text>
        </Card.Body>
      </Card>
      );
 }