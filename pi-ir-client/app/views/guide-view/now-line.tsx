import { CSSProperties } from "react";
import styles from "./styles.module.css";
const getLineStyle = (props: NowLineProps): CSSProperties => ({
    left: `${Math.round(props.left)}px`,
  });
  type NowLineProps = {
    readonly left: number;
  };
  export const NowLine = ({ left }: NowLineProps) => {
    return <div className={styles.nowLine} style={getLineStyle({ left })}></div>;
  };