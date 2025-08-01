import TitleCompo from "@/components/TitleCompo";
import { ApproveUserStyled } from "./styled";
import api from "@/utill/api";
import { Button, message, Modal, Table, Descriptions, Input } from "antd";
import { useEffect, useState } from "react";

// 그냥 user에 있는 정보 다 보내주기
const dummyUsers = [
  {
    id: 1,
    name: "김소상",
    phone: "010-1111-1111",
    email: "bizuser@test.com",
    role: "biz",
    acceptStatus: "pending",
    agreeRequired: true,
    agreeOptional: false,
    extraInfo: {
      bizName: "김가게",
      bizLicense: "https://via.placeholder.com/150",
      bizCategory: "카페",
      bizPostcode: "12345",
      bizAddress: "서울시 강남구 테헤란로",
      bizAddressDetail: "101호",
      bizPhone: "02-123-4567",
    },
  },
  {
    id: 2,
    name: "박미디어",
    phone: "010-2222-2222",
    email: "mediauser@test.com",
    role: "media",
    acceptStatus: "pending",
    agreeRequired: true,
    agreeOptional: true,
    extraInfo: {
      companyName: "MBC",
      programName: "뉴스데스크",
      proofFile: "https://via.placeholder.com/150",
      department: "보도국",
      purpose: "보도자료 수집",
    },
  },
  {
    id: 3,
    name: "이인플",
    phone: "010-3333-3333",
    email: "influuser@test.com",
    role: "influ",
    acceptStatus: "pending",
    agreeRequired: true,
    agreeOptional: false,
    extraInfo: {
      representativeName: "이인플",
      influLicense: "https://via.placeholder.com/150",
      influDepartment: "패션",
      influType: "유튜브",
      influPurpose: "홍보",
      promoUrl: "https://youtube.com/influ",
    },
  },
];

const ApproveUser = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const fetchUsers = async () => {
    try {
      // TODO: 해당하는 유저들 불러오기(승인 대기중인 유저 + 거절한 유저 정보 불러오기)
      const res = await api.get("/admin/users", {
        params: { status: "pending" },
      });
      console.log(res.data, "승인 대기 중이거나 거절당한 유저들");
      setUsers(res.data.users);

      // 더미 데이터 사용(더미데이터는 그냥 쓴거라서 그냥 해당 유저정보들 다 보내주면 됨)
      // setUsers(dummyUsers);
    } catch (error) {
      console.error(error);
      message.error("유저 목록을 불러오는데 실패했습니다.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 회원 승인
  const handleApprove = async (userId: number) => {
    try {
      // TODO: 회원가입 승인
      await api.patch(`/admin/users/${userId}/accept`, {
        status: "accept",
      });
      message.success("승인 완료되었습니다.");
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (error) {
      console.error(error);
      message.error("승인 처리에 실패했습니다.");
    }
  };

  // 회원 거절 (거절 사유 작성)
  const openRejectModal = (user: any) => {
    setSelectedUser(user);
    setRejectReason("");
    setRejectModalOpen(true);
  };

  const confirmReject = async () => {
    if (!rejectReason.trim()) {
      message.warning("거절 사유를 작성해주세요.");
      return;
    }
    try {
      console.log(rejectReason, "이유", selectedUser.id);
      await api.patch(`/admin/users/${selectedUser.id}/accept`, {
        status: "reject",
        reason: rejectReason,
      });
      message.success("거절 완료되었습니다.");
      setRejectModalOpen(false);
      fetchUsers();
    } catch (error) {
      console.error(error);
      message.error("거절 처리에 실패했습니다.");
    }
  };

  // 테이블 컬럼
  const columns = [
    { title: "이름", dataIndex: "name", key: "name" },
    { title: "전화번호", dataIndex: "phone", key: "phone" },
    { title: "이메일", dataIndex: "email", key: "email" },
    {
      title: "회원유형",
      dataIndex: "role",
      key: "role",
      render: (role: string) =>
        role === "biz"
          ? "소상공인"
          : role === "media"
          ? "방송국"
          : "인플루언서",
    },
    {
      title: "상태",
      dataIndex: "acceptStatus",
      key: "acceptStatus",
      render: (status: string) =>
        status === "pending" ? "대기" : status === "accept" ? "승인" : "거절",
    },
    {
      title: "관리",
      key: "actions",
      render: (_: any, record: any) => (
        <>
          <Button
            style={{ marginRight: 8 }}
            onClick={(e) => {
              e.stopPropagation();
              Modal.confirm({
                title: "해당 유저를 승인하시겠습니까?",
                centered: true,
                onOk: () => handleApprove(record.id),
              });
            }}
          >
            수락
          </Button>
          <Button
            danger
            onClick={(e) => {
              e.stopPropagation();
              openRejectModal(record);
            }}
          >
            거절
          </Button>
        </>
      ),
    },
  ];

  // 추가정보
  const renderExtraInfo = (user: any) => {
    const { extraInfo } = user;
    if (!extraInfo) return null;
    if (user.role === "biz") {
      // 소상공인 추가 정보
      return (
        <>
          <Descriptions.Item label="업체명">
            {extraInfo.bizName}
          </Descriptions.Item>
          <Descriptions.Item label="사업자 등록증">
            <a
              href={extraInfo.bizLicense}
              target="_blank"
              rel="noopener noreferrer"
            >
              파일 보기
            </a>
          </Descriptions.Item>
          <Descriptions.Item label="업종">
            {extraInfo.bizCategory}
          </Descriptions.Item>
          <Descriptions.Item label="업체 주소">
            {`${extraInfo.bizAddress} ${extraInfo.bizAddressDetail || ""}`}
          </Descriptions.Item>
          <Descriptions.Item label="업체 전화번호">
            {extraInfo.bizPhone}
          </Descriptions.Item>
        </>
      );
    } else if (user.role === "media") {
      // 방송국 추가정보
      return (
        <>
          <Descriptions.Item label="회사명">
            {extraInfo.companyName}
          </Descriptions.Item>
          <Descriptions.Item label="담당 프로그램명">
            {extraInfo.programName}
          </Descriptions.Item>
          <Descriptions.Item label="재직 증명서">
            <a
              href={extraInfo.proofFile}
              target="_blank"
              rel="noopener noreferrer"
            >
              파일 보기
            </a>
          </Descriptions.Item>
          <Descriptions.Item label="소속 부서">
            {extraInfo.department}
          </Descriptions.Item>
          <Descriptions.Item label="가입 목적">
            {extraInfo.purpose}
          </Descriptions.Item>
        </>
      );
    } else if (user.role === "influ") {
      // 인플루언서 추가 정보
      return (
        <>
          <Descriptions.Item label="대표 이름">
            {extraInfo.representativeName}
          </Descriptions.Item>
          <Descriptions.Item label="사업자 등록증">
            <a
              href={extraInfo.influLicense}
              target="_blank"
              rel="noopener noreferrer"
            >
              파일 보기
            </a>
          </Descriptions.Item>
          <Descriptions.Item label="소속 부서">
            {extraInfo.influDepartment}
          </Descriptions.Item>
          <Descriptions.Item label="형태">
            {extraInfo.influType}
          </Descriptions.Item>
          <Descriptions.Item label="가입 목적">
            {extraInfo.influPurpose}
          </Descriptions.Item>
          <Descriptions.Item label="홍보용 링크">
            <a
              href={extraInfo.promoUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              링크 보기
            </a>
          </Descriptions.Item>
        </>
      );
    }
  };

  return (
    <ApproveUserStyled>
      <TitleCompo title="회원 승인 관리" />
      <Table
        columns={columns}
        dataSource={users}
        rowKey={(record) => record.id.toString()}
        onRow={(record) => ({
          onClick: () => {
            setSelectedUser(record);
            setModalOpen(true);
          },
        })}
      />

      {/* 상세 정보 모달 */}
      <Modal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        centered
      >
        {selectedUser && (
          <Descriptions title="회원 상세 정보" bordered size="small" column={1}>
            <Descriptions.Item label="이름">
              {selectedUser.name}
            </Descriptions.Item>
            <Descriptions.Item label="전화번호">
              {selectedUser.phone}
            </Descriptions.Item>
            <Descriptions.Item label="이메일">
              {selectedUser.email}
            </Descriptions.Item>
            <Descriptions.Item label="회원유형">
              {selectedUser.role === "biz"
                ? "소상공인"
                : selectedUser.role === "media"
                ? "방송국"
                : "인플루언서"}
            </Descriptions.Item>
            {renderExtraInfo(selectedUser)}
          </Descriptions>
        )}
      </Modal>

      {/* 거절 사유 작성 모달 */}
      <Modal
        open={rejectModalOpen}
        onCancel={() => setRejectModalOpen(false)}
        onOk={confirmReject}
        centered
        okText="거절하기"
        cancelText="취소"
      >
        <p>거절 사유를 작성해주세요.</p>
        <Input.TextArea
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          rows={4}
          placeholder="거절 사유 입력"
        />
      </Modal>
    </ApproveUserStyled>
  );
};

export default ApproveUser;
