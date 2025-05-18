import React from "react";
import Section from "./Section";
import Button from "./Button";

const Tools = ({ name, url }) => {
  return (
    <Section id="tools">
      <div className="container relative z-2">
        {name && url && <Button href={url}>{name}</Button>}
      </div>
    </Section>
  );
};

export default Tools;
