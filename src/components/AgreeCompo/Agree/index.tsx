import axios from "axios";
import { AgreeStyled } from "./styled";
import { useEffect, useState } from "react";
import { Table, Button, Modal } from "antd";
interface failporps {
  fail: any;
  setFail: (value: string) => void;
  setUserId: (value: string) => void;
  setPlate: (value: string) => void;
}
const Agree = ({ fail, setFail, setUserId, setPlate }: failporps) => {
  const [num, setNum] = useState(0);
  //승인 상태 승인으로 변경 함수
  const pendding = (userId: number) => {
    axios
      .post("http://15.164.52.122:5000/admins/pendding", { userId })
      .then((res) => {
        console.log(res.data);
        setNum(num + 1);
      });
  };

  const [file, setFile] = useState([]);
  useEffect(() => {
    axios.get("http://15.164.52.122:5000/admins/fileinfo").then((res) => {
      console.log(res.data);
      setFile(res.data);
    });
  }, [num]);

  const dataSource = file
    ? file.map((x: any, i: number) => {
        const fileUrl = `http://15.164.52.122:5000/uploads/${encodeURIComponent(
          x.u_certification
        )}`;
        return {
          key: String(i + 1),
          name: x.u_name,
          email: x.u_email,
          plateNum: x.v_plate_num,
          fileUrl, // 저장 가능
          file: (
            <a href={fileUrl} target="_blank" rel="noopener noreferrer">
              <Button>파일 보기</Button>
            </a>
          ),
          agree: (
            <Button
              onClick={() => {
                Modal.confirm({
                  title: "승인 요청",
                  content: "정말 승인하시겠습니까?",
                  okText: "승인",
                  cancelText: "취소",
                  onOk: () => pendding(x.u_id),
                });
              }}
            >
              승인
            </Button>
          ),
          refuse: (
            <Button
              onClick={() => {
                setFail("block");
                setUserId(x.u_id);
                setPlate(x.v_plate_num);
              }}
            >
              거절
            </Button>
          ),
        };
      })
    : [];

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "plateNum",
      dataIndex: "plateNum",
      key: "plateNum",
    },
    {
      title: "file",
      dataIndex: "file",
      key: "file",
    },
    {
      title: "승인",
      dataIndex: "agree",
      key: "agree",
    },
    {
      title: "거절",
      dataIndex: "refuse",
      key: "refuse",
    },
  ];
  return (
    <>
      <Table dataSource={dataSource} columns={columns} />
    </>
  );
};

export default Agree;
