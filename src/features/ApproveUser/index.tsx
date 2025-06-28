import TitleCompo from "@/components/TitleCompo";
import { ApproveUserStyled } from "./styled";
import api from "@/utill/api";
import { Button, message, Modal, Table } from "antd";
import { useEffect, useState } from "react";
import { useUserStore } from "@/store/useAdminStore";

const ApproveUser = () => {
  const [users, setUsers] = useState();

  const user = useUserStore((state) => state.user);
  console.log(user);

  const fetchUsers = async () => {
    try {
      // 상태가 pending인 유저 불러오기
      const res = await api.get("/admin/users");
      console.log("유저저저", res.data);
      const data = res.data.map((item: any) => ({
        key: item.id.toString(),
        id: item.id,
        name: item.name,
        phone: item.phone,
        role: item.role,
      }));
      setUsers(data);
    } catch (error) {
      message.error("모든 신청을 불러오는데 실패했습니다.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns = [
    {
      title: "이름",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "전화번호",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "회원유형",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "관리",
      key: "approve",
      render: (data: any) => (
        <>
          <Button
            className="matching_accept_button"
            onClick={(e) => {
              e.stopPropagation();

              Modal.confirm({
                title: "해당 유저의 회원 신청을 승인하시겠습니까?",
                // content: "해당 유저에게 알림이 갑니다.",
                cancelText: "아니요",
                okText: "예",
                centered: true,
                okButtonProps: {
                  style: { backgroundColor: "#5DA487" },
                },
                cancelButtonProps: {
                  style: { color: "#5DA487" },
                },
                async onOk() {
                  try {
                    // 수락
                    // await axiosInstance.post(`/matching/accept`, {
                    //   applyId: data.applyId, // 신청(apply) id
                    //   adminId,
                    //   userId: data.id,
                    // });
                    // notification.success({
                    //   message: `승인 완료`,
                    //   description: `승인이 완료되었습니다.`,
                    // });
                    // getApplyList();
                  } catch (e) {
                    console.error("해당 유저 승인 실패: ", e);
                    // notification.error({
                    //   message: `승인 실패`,
                    //   description: `해당 유저 승인이 실패했습니다.`,
                    // });
                  }
                },
              });
            }}
          >
            수락
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              // setSelectedUser(data); // 어떤 유저인지 저장
              // setIsModalVisible(true); // 모달 열기
            }}
          >
            거절
          </Button>
        </>
      ),
    },
  ];

  return (
    <ApproveUserStyled>
      <TitleCompo title="승인 관리" />
      <Table columns={columns} dataSource={users} />
    </ApproveUserStyled>
  );
};

export default ApproveUser;
