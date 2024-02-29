import { useEffect } from "react"
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import CodeMirror from "codemirror";



function Editor() {

    useEffect(() => {
      let cm:any;
      async function init() {
        cm = CodeMirror.fromTextArea(document.getElementById('code-editor') as HTMLTextAreaElement, {
          mode: { name: 'javascript', json: true },
          theme: 'dracula',
          autoCloseTags: true,
          autoCloseBrackets: true,
          lineNumbers: true,
        })
      }
      init()
      return () => {
        cm && cm.toTextArea();
      }
    }, [])

    

    

    

  return (
    <div>Editor

        <textarea className="w-full h-full" id="code-editor" placeholder="Write your code here..."></textarea>


    </div>
  )
}

export default Editor