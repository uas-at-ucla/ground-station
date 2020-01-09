import React from "react";

interface ReadoutProps {
  data: { key: string; values: (number | string)[] }[];
}

const Readout = (props: ReadoutProps) => {
  return (
    <div className="Readout">
      {props.data.map((comp, i) => (
        <KeyValue key={i} keyName={comp["key"]} values={comp["values"]} />
      ))}
    </div>
  );
};

export default Readout;

interface KeyValueProps {
  key: number;
  keyName: string;
  values: (number | string)[];
}

const KeyValue = (props: KeyValueProps) => {
  let valueString = "";

  for (const value of props.values) {
    valueString += value;
  }

  return (
    <div className="KeyValue">
      <h1> {props.keyName} </h1>
      <h2> {valueString} </h2>
    </div>
  );
};
