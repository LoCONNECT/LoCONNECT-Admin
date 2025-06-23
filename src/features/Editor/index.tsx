import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
interface ToastEditorWithRefProps {
  initialValue?: string;
  height?: string;
  previewStyle?: "vertical" | "tab";
  initialEditType?: "markdown" | "wysiwyg";
}

const ToastEditorWithRef = forwardRef<any, ToastEditorWithRefProps>(
  (
    {
      initialValue = "",
      height = "300px",
      previewStyle = "vertical",
      initialEditType = "wysiwyg",
    },
    ref
  ) => {
    const editorRef = useRef<any>(null);

    // 부모가 ref.current.getInstance() 호출할 수 있도록 전달
    useImperativeHandle(ref, () => ({
      getInstance: () => editorRef.current?.getInstance(),
      setHTML: (html: string) =>
        editorRef.current?.getInstance()?.setHTML(html),
      getHTML: () => editorRef.current?.getInstance()?.getHTML(),
    }));

    return (
      <Editor
        ref={editorRef}
        initialValue={initialValue}
        height={height}
        previewStyle={previewStyle}
        initialEditType={initialEditType}
        useCommandShortcut={true}
      />
    );
  }
);

export default ToastEditorWithRef;
