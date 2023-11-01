import MonacoEditor from "@alilc/lowcode-plugin-base-monaco-editor";

const LcFormItemEditor = ({ defaultValue, value, onChange, language = "javascript" }: any) => {

  return (
    <MonacoEditor
      style={{ border: '1px solid rgba(31,56,88,.4)' }}
      theme="vs-vision"
      value={value}
      defaultValue={defaultValue}
      language={language}
      onChange={onChange}
    />
  )
}

export default LcFormItemEditor
