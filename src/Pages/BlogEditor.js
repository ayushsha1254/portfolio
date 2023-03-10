import React from "react";
import { Editor } from "react-draft-wysiwyg";
import { convertToRaw } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
const BlogEditor = () => {
  const [editorState, setEditorState] = React.useState();
  const handleEditor = (e, editor) => {
    console.log(editor);
    setEditorState(editor);
  };
  return (
    <div>
      <div>Editor</div>
      <Editor
        editorState={editorState}
        toolbarClassName="toolbarClassName"
        wrapperClassName="wrapperClassName"
        editorClassName="editorClassName"
        onEditorStateChange={(e) => {
          setEditorState(e);
          console.log(convertToRaw(e.getCurrentContent()));
          console.log(e.getCurrentContent().getPlainText());
        }}
      />
    </div>
  );
};

export default BlogEditor;
