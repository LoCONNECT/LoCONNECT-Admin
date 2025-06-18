import { AgreeStyled } from "./styled";
import TitleCompo from "../TitleCompo";
import Agree from "./Agree";
import PointAgree from "./PointAgree";
import ItemAgree from "./ItemAgree";
import FailedModal from "./Agree/FailedModal";
import { useEffect, useState } from "react";
interface AgreeProps {
  type?: string;
}
const AgreeCompo = ({ type }: AgreeProps) => {
  const [fail, setFail] = useState("none");
  const [userId, setUserId] = useState<string>("");
  const [num, setNum] = useState(0);
  const [plate, setPlate] = useState("");

  useEffect(() => {}, [num]);
  return (
    <AgreeStyled>
      <TitleCompo
        title={
          type === "file"
            ? "공인 인증서 승인"
            : type === "point"
            ? "환전 승인"
            : "물품 등록 승인"
        }
      />
      {type === "file" ? (
        <Agree
          setPlate={setPlate}
          fail={fail}
          setFail={setFail}
          setUserId={setUserId}
        />
      ) : type === "point" ? (
        <PointAgree />
      ) : (
        <ItemAgree
          setPlate={setPlate}
          fail={fail}
          setFail={setFail}
          setUserId={setUserId}
        />
      )}
      {fail === "none" ? (
        <></>
      ) : (
        <FailedModal
          plate={plate}
          num={num}
          setNum={setNum}
          valuetype={type}
          fail={fail}
          setFail={setFail}
          userId={userId}
        />
      )}
    </AgreeStyled>
  );
};

export default AgreeCompo;
