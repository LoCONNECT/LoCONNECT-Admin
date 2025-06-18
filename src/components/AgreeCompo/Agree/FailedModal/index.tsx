import { FailedModatStyled } from "./styled";
import { Button, Modal, Select } from "antd";
import axios from "axios";
import clsx from "clsx";
import { useState } from "react";
interface failProps {
  fail: any;
  setFail: any;
  setNum: any;
  num: number;
  userId: string;
  valuetype?: string;
  plate: string;
}

const FailedModal = ({
  num,
  setNum,
  valuetype,
  fail,
  setFail,
  userId,
  plate,
}: failProps) => {
  console.log(plate);
  console.log(valuetype);
  const [type, setType] = useState("");
  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
    setType(value);
  };
  const failvalue = () => {
    console.log(userId);
    console.log(type);
    axios
      .post("http://15.164.52.122:5000/notification/failvalue", {
        type,
        userId,
        valuetype,
        plate,
      })
      .then((res) => {
        console.log(res.data);
        setFail("none");
        setNum(num + 1);
        window.location.reload();
      }); // 공동인증서 거절 시 거절 사유 타입으로 요청
  };

  const fileOptions = [
    { value: "1", label: "공인인증서가 유효하지 않음" },
    { value: "2", label: "제출된 정보 부족" },
    { value: "3", label: "관리자 판단에 따라 거절" },
  ];

  const itemOptions = [
    { value: "1", label: "차량 이미지가 유효하지 않음" },
    { value: "2", label: "제출된 정보 부족" },
    { value: "3", label: "관리자 판단에 따라 거절" },
  ];

  return (
    <FailedModatStyled className={clsx("FailedModal-wrap")}>
      <div className="FailedModal-container">
        <div className="FailedModal-title">거절 사유 전송 타입 선택</div>
        <Select
          defaultValue="거절 사유 선택"
          style={{ width: 250 }}
          onChange={handleChange}
          options={valuetype === "file" ? fileOptions : itemOptions}
        />
        <Button
          onClick={() => {
            Modal.confirm({
              title: "전송 요청",
              content: "정말 전송하시겠습니까?",
              okText: "전송",
              cancelText: "취소",
              onOk: () => failvalue(),
            });
          }}
        >
          전송
        </Button>
        <Button
          onClick={() => {
            setFail("none");
          }}
        >
          취소
        </Button>
      </div>
    </FailedModatStyled>
  );
};

export default FailedModal;
