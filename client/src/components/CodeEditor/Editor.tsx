import { useEffect, useState } from "react";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import CodeMirror from "codemirror";
import { useRef } from "react";

// @ts-ignore
function Editor({ socketRef, roomId, codeChange }) {
  const editorRef = useRef<CodeMirror.Editor | null>(null);

  useEffect(() => {
    let cm: any;

    async function init() {
      cm = CodeMirror.fromTextArea(
        document.getElementById("code-editor") as HTMLTextAreaElement,
        {
          mode: { name: "javascript", json: true },
          theme: "dracula",
          autoCloseTags: true,
          autoCloseBrackets: true,
          lineNumbers: true,
        }
      );
      cm.setSize(980, 500);
      cm.setOption("fontSize", 20);
      editorRef.current = cm;

      cm.on("change", (instance: any, changes: any) => {
        console.log("Editor change detected:", changes);
        const { origin } = changes;
        const code = instance.getValue();
        codeChange(code);
        if (origin !== "setValue") {
          socketRef.current?.emit("code-change", {
            roomId: roomId,
            code: code,
          });
        }
      });
    }

    init();

    return () => {
      cm && cm.toTextArea();
    };
  }, []);

  useEffect(() => {
    if (!socketRef.current) return;

    socketRef.current.on("code-change", (code: string) => {
      console.log("Code received from server:", code);
      editorRef.current?.setValue(code);
    });

    socketRef.current.on("code-sync", (code: string) => {
      console.log("Code sync received from server:", code);
      editorRef.current?.setValue(code);
    });

    return () => {
      socketRef.current?.off("code-change");
      socketRef.current?.off("code-sync");
    };
  }, [socketRef.current]);

  return (
    <div className="h-full p-4">
      <div className="text-lg font-bold mb-2">Editor</div>
      <textarea
        style={{ fontSize: "20px", cursor: "pointer" }}
        className="w-full h-full border"
        id="code-editor"
        placeholder="Write your code here..."
      ></textarea>
    </div>
  );
}

export default Editor;
