import { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, message } from "antd";
import { NoticeStyled } from "./styled";
import api from "@/utill/api";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import { useRef } from "react";
import dynamic from "next/dynamic";

interface NoticeItem {
  key: string;
  title: string;
  content: string;
}
const ToastEditor = dynamic(
  () => import("@toast-ui/react-editor").then((mod) => mod.Editor),
  {
    ssr: false,
  }
);
const Notice = () => {
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [form] = Form.useForm();
  const editorRef = useRef<any>(null); // Toast Editor의 ref

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
      const values = await form.validateFields();
      const content = editorRef.current?.getInstance().getHTML();

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
    } catch (error) {
      message.error("오류가 발생했습니다.");
    }
  };

  const openAddModal = () => {
    setIsEditMode(false);
    form.resetFields();
    setIsModalOpen(true);
  };

  const openEditModal = (record: NoticeItem) => {
    setIsEditMode(true);
    setEditingKey(record.key);
    form.setFieldsValue({ title: record.title, content: record.content });
    setIsModalOpen(true);
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
            <ToastEditor
              ref={editorRef}
              initialValue=""
              previewStyle="vertical"
              height="300px"
              initialEditType="wysiwyg"
              useCommandShortcut={true}
            />
          </Form.Item>
        </Form>
      </Modal>
    </NoticeStyled>
  );
};

export default Notice;
