"use client";
import { HTMLInputTypeAttribute, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

export type Props = {
  readonly label: string;
  readonly buttonLabel: string;
  readonly className?: string;
  readonly click: (value?: string) => void;
  readonly type?: HTMLInputTypeAttribute;
};

export default function Input({ buttonLabel, label, type, click }: Props) {
  const [value, setValue] = useState<string>("");

  const onClick = () => {
    click(value);
  };
  return (
    <InputGroup className="mb-3">
      <Form.Control
        placeholder={label}
        aria-label={label}
        aria-describedby="basic-addon2"
        type={type}
        onChange={(e) => {
          return setValue(e.target.value);
        }}
      />
      <Button variant="outline-secondary" id="button-addon2" onClick={onClick}>
        {buttonLabel}
      </Button>
    </InputGroup>
  );
}
