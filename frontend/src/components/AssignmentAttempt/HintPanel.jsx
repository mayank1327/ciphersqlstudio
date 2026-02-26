const HintPanel = ({ hint, loading }) => {
    if (!hint && !loading) return null;
  
    return (
      <div className="hint-panel">
        <div className="hint-panel__title">
          💡 Hint
        </div>
        {loading ? (
          <div className="hint-panel__loading">
            Generating hint...
          </div>
        ) : (
          <div className="hint-panel__text">
            {hint}
          </div>
        )}
      </div>
    );
  };
  
  export default HintPanel;