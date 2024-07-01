import { useEffect, useState} from "react";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import CodeMirror from "codemirror";
import { useRef } from "react";




function Editor({ socketRef, roomId, onCodeChange }) {
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
      cm.setSize(980,500)
      cm.setOption("fontSize", 20);
      editorRef.current = cm;
      cm.on("change", (instance: { getValue: () => any }, changes: any) => {
        console.log(changes);
        const { origin } = changes;
        const code = instance.getValue();
        onCodeChange(code);
        if (origin! == "setValue") {
          socketRef.current?.emit("code-change", {
            roomId,
            code,
          });
        }
      });
    }

    init();
    return () => {
      cm && cm.toTextArea();
    };
  }, []);


  return (
    <div className="h-full p-4">
      <div className="text-lg font-bold mb-2">Edito</div>
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
