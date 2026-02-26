import Editor from '@monaco-editor/react';

const SqlEditor = ({
  value,
  onChange,
  onExecute,
  onHint,
  executing,
  hintLoading
}) => {
  return (
    <div className="sql-editor">

      <div className="sql-editor__header">
        <span className="sql-editor__title">SQL Editor</span>
        <div className="sql-editor__actions">
          <button
            className="sql-editor__hint-btn"
            onClick={onHint}
            disabled={hintLoading}
          >
            {hintLoading ? '...' : '💡 Hint'}
          </button>
          <button
            className="sql-editor__run-btn"
            onClick={onExecute}
            disabled={executing}
          >
            {executing ? 'Running...' : '▶ Run'}
          </button>
        </div>
      </div>

      <Editor
        height="200px"
        language="sql"
        theme="vs-dark"
        value={value}
        onChange={onChange}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
          padding: { top: 12 }
        }}
      />

    </div>
  );
};

export default SqlEditor;