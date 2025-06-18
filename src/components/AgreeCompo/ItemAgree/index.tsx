import axios from "axios";
import { useEffect, useState } from "react";
import { Table, Button, Modal } from "antd";

interface itemProps {
  fail: string;
  setFail: (value: string) => void;
  setUserId: (value: string) => void;
  setPlate: (value: string) => void;
}

const ItemAgree = ({ setPlate, fail, setFail, setUserId }: itemProps) => {
  const [item, setItem] = useState([]);
  const [num, setNum] = useState(0);
  useEffect(() => {
    axios.get("http://15.164.52.122:5000/admins/iteminfo").then((res) => {
      console.log(res.data);
      const filteredData = res.data
        .filter((x: any) => x.a_write_status === "waiting")
        .sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ); // 최신순 정렬

      setItem(filteredData);
    });
  }, [num]); // 경매 물품 요청 누나 원하는 데이터 양식으로 보내줘 필수값(유저 아이디 , 타이틀 ,이미지)

  // 경매 승인 버튼 온클릭시 요청
  const success = (userid: string, platenum: string) => {
    axios
      .post("http://15.164.52.122:5000/admins/iteminfo/sucess", {
        userid,
        platenum,
      })
      .then((res) => {
        console.log(res.data);
        setNum(num + 1);
      });
  };

  const dataSource = item
    ? item.map((x: any, i: number) => ({
        key: String(i + 1), // key는 문자열로 변환
        name: x.u_name,
        email: x.u_email,
        title: x.v_title,
        plateNum: x.v_plate_num,
        file: x.v_car_img,
        agree: (
          <Button
            onClick={() => {
              Modal.confirm({
                title: "승인 요청",
                content: "정말 승인하시겠습니까?",
                okText: "승인",
                cancelText: "취소",
                onOk: () => success(x.u_id, x.v_plate_num),
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
      }))
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
      title: "title",
      dataIndex: "title",
      key: "title",
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
      render: (paths: string) => {
        const firstImage = paths?.split(",")[0]?.trim();
        return firstImage ? (
          <img
            src={`http://15.164.52.122:5000/uploads/${firstImage}`}
            alt="car"
            style={{ maxWidth: "100px" }}
          />
        ) : (
          <span>이미지 없음</span>
        );
      },
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
  return <Table dataSource={dataSource} columns={columns} />;
};

export default ItemAgree;
