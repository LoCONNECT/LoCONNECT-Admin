import axios from "axios";
import { useEffect, useState } from "react";
import { Table, Button } from "antd";

const PoinAgree = () => {
  const [user, setUser] = useState([]);
  useEffect(() => {
    axios.get("http://15.164.52.122:5000/admins/return").then((res) => {
      const filteredData = res.data
        .filter((item: any) => item.amount !== 0)
        .sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      setUser(filteredData);
    });
  }, []);

  const pointreturn = (userId: number) => {
    axios
      .post("http://15.164.52.122:5000/admins/pointsuccess", { userId })
      .then((res) => {
        console.log(res);
        window.location.reload();
      });
  };

  const dataSource = user
    ? user.map((x: any, i: number) => ({
        key: String(i + 1), // key는 문자열로 변환
        name: x.name,
        email: x.email,
        bank: x.cardCompany,
        account: x.account,
        amount: `${x.amount}원`,
        agree: (
          <Button
            onClick={() => {
              pointreturn(x.userId);
            }}
          >
            승인
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
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "bank",
      dataIndex: "bank",
      key: "bank",
    },
    {
      title: "account",
      dataIndex: "account",
      key: "account",
    },
    {
      title: "amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "승인",
      dataIndex: "agree",
      key: "agree",
    },
  ];

  return <Table dataSource={dataSource} columns={columns} />;
};

export default PoinAgree;
