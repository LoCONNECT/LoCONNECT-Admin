import clsx from "clsx";
import { TitleCompoStyled } from "./stlyed";
import { Button } from "antd";

import { useEffect, useState } from "react";

interface TitleProps {
  title: string;
  button?: string;
  setPlusModal?: any;
}

const TitleCompo = ({ title, button, setPlusModal }: TitleProps) => {
  const plusImg = () => {
    setPlusModal("block");
  };

  return (
    <TitleCompoStyled className={clsx("title-compo")}>
      <div className="title-header">
        <h3>{title}</h3>
        {button && <Button onClick={plusImg}>{button}</Button>}
      </div>
    </TitleCompoStyled>
  );
};

export default TitleCompo;
