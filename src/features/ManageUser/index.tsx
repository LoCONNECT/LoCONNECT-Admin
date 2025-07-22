import { useCallback, useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import TitleCompo from "@/components/TitleCompo";
import { Modal, Select, Table, Input, notification, Descriptions } from "antd";
import api from "@/utill/api";
import { ManangeUserStyled } from "./styled";

const { Search } = Input;

interface UserType {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  extraInfo?: any;
}

const ManageUser = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectSearch, setSelectSearch] = useState<"name" | "role">("name");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const fetchUsers = useCallback(
    async (word: string = "") => {
      try {
        // TODO: 해당하는 유저들 불러오기(승인된 유저 정보 불러오기)
        const res = await api.get("/admin/users", {
          params: {
            status: "approve", // 승인된 회원
            searchType: selectSearch, // 검색 조건(이름 or 회원유형)
            searchWord: word.trim(), // 검색어(검색어가 빈값인 경우 승인된 회원만 출력)
          },
        });
        setUsers(res.data);
      } catch (e) {
        console.error("회원 불러오기 실패: ", e);
        notification.error({
          message: "회원 불러오기 실패",
          description: "회원 목록을 불러오는데 실패했습니다.",
        });
      }
    },
    [selectSearch]
  );

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const onSearch = useCallback(
    (value: string) => {
      fetchUsers(value);
    },
    [fetchUsers]
  );

  const columns = useMemo(
    () => [
      {
        key: "number",
        title: "번호",
        render: (_: any, __: any, index: number) =>
          (pagination.current - 1) * pagination.pageSize + index + 1,
      },
      {
        key: "name",
        title: "이름",
        dataIndex: "name",
      },
      {
        key: "email",
        title: "이메일",
        dataIndex: "email",
      },
      {
        key: "phone",
        title: "전화번호",
        dataIndex: "phone",
      },
      {
        key: "role",
        title: "회원유형",
        render: (_: any, record: UserType) =>
          record.role === "biz"
            ? "소상공인"
            : record.role === "media"
            ? "방송국"
            : "인플루언서",
      },
    ],
    [pagination]
  );

  const searchOptions = [
    { value: "name", label: "이름" },
    { value: "role", label: "회원유형" },
  ];

  const renderExtraInfo = (user: UserType) => {
    const { extraInfo } = user;
    if (!extraInfo) return null;

    if (user.role === "biz") {
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
            {extraInfo.bizAddress} {extraInfo.bizAddressDetail || ""}
          </Descriptions.Item>
          <Descriptions.Item label="업체 전화번호">
            {extraInfo.bizPhone}
          </Descriptions.Item>
        </>
      );
    } else if (user.role === "media") {
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
    <ManangeUserStyled className={clsx("manageuser_wrap")}>
      <TitleCompo title="회원 관리" />

      <div className="manageuser_info">
        <Select
          value={selectSearch}
          options={searchOptions}
          style={{ width: 100 }}
          onChange={(value) => setSelectSearch(value as "name" | "role")}
        />
        <Search
          placeholder="검색어 입력"
          allowClear
          onSearch={onSearch}
          style={{ width: 200, marginLeft: 4 }}
        />
      </div>

      <Table
        columns={columns}
        dataSource={users}
        pagination={{
          ...pagination,
          onChange: (page, pageSize) => {
            setPagination({ current: page, pageSize });
          },
        }}
        rowKey="id"
        onRow={(record) => ({
          onClick: () => {
            setSelectedUser(record);
            setModalOpen(true);
          },
        })}
      />

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
    </ManangeUserStyled>
  );
};

export default ManageUser;
