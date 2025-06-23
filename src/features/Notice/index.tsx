import { useEffect, useRef, useState } from "react";
import { Table, Button, Modal, Form, Input, message } from "antd";
import { NoticeStyled } from "./styled";
import api from "@/utill/api";
import ToastEditorWithRef from "../Editor";
interface NoticeItem {
  key: string;
  title: string;
  content: string;
}

const Notice = () => {
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [form] = Form.useForm();
  const editorRef = useRef<any>(null);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const res = await api.get("/allnotices");
      const data = res.data.map((item: any) => ({
        key: item.id.toString(),
        title: item.title,
        content: item.content,
      }));
      setNotices(data);
    } catch (error) {
      message.error("공지사항을 불러오는데 실패했습니다.");
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields(); // 제목 유효성 검사
      const editorInstance = editorRef.current?.getInstance?.();
      const content = editorInstance?.getHTML?.();
      console.log(content, values.title);
      if (!content || content === "<p><br></p>") {
        message.error("내용을 입력해주세요.");
        return;
      }

      const payload = {
        title: values.title,
        content,
      };

      if (isEditMode && editingKey !== null) {
        await api.patch(`/notices/${editingKey}`, payload);
        message.success("수정되었습니다.");
      } else {
        await api.post("/notices", payload);
        message.success("등록되었습니다.");
      }

      setIsModalOpen(false);
      form.resetFields();
      fetchNotices();
    } catch (err) {
      // validateFields에서 에러가 발생하면 여기로 옴
      console.error("폼 유효성 검사 실패", err);
      message.error("필수 항목을 모두 입력해주세요.");
    }
  };
  const openAddModal = () => {
    setIsEditMode(false);
    form.resetFields();
    setIsModalOpen(true);
    setTimeout(() => {
      editorRef.current?.getInstance?.()?.setHTML("");
    }, 0);
  };

  const openEditModal = (record: NoticeItem) => {
    setIsEditMode(true);
    setEditingKey(record.key);
    form.setFieldsValue({ title: record.title });
    setIsModalOpen(true);
    setTimeout(() => {
      editorRef.current?.getInstance?.()?.setHTML(record.content || "");
    }, 0);
  };

  const columns = [
    {
      title: "제목",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "내용",
      dataIndex: "content",
      key: "content",
    },
    {
      title: "관리",
      key: "action",
      render: (_: any, record: NoticeItem) => (
        <Button type="link" onClick={() => openEditModal(record)}>
          수정
        </Button>
      ),
    },
  ];

  return (
    <NoticeStyled>
      <Button
        type="primary"
        onClick={openAddModal}
        style={{ marginBottom: 16 }}
      >
        공지사항 추가
      </Button>
      <Table columns={columns} dataSource={notices} pagination={false} />

      <Modal
        title={isEditMode ? "공지사항 수정" : "공지사항 추가"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        okText="저장"
        cancelText="취소"
        styles={{
          body: { maxHeight: "70vh", overflowY: "auto" },
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="제목"
            rules={[{ required: true, message: "제목을 입력해주세요." }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="내용">
            <ToastEditorWithRef
              ref={editorRef}
              initialValue="내용"
              height="300px"
              previewStyle="vertical"
              initialEditType="wysiwyg"
            />
          </Form.Item>
        </Form>
      </Modal>
    </NoticeStyled>
  );
};

export default Notice;
