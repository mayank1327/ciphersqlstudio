const ResultsPanel = ({ result, loading }) => {
    return (
      <div className="results-panel">
  
        <div className="results-panel__header">
          <span>Results</span>
        </div>
  
        <div className="results-panel__content">
  
          {/* Initial state */}
          {!result && !loading && (
            <div className="results-panel__empty">
              <span>▶</span>
              <span>Run your query to see results</span>
            </div>
          )}
  
          {/* Loading state */}
          {loading && (
            <div className="results-panel__empty">
              <span>Executing query...</span>
            </div>
          )}
  
          {/* Error state */}
          {result && !result.success && (
            <div className="results-panel__error">
              ❌ {result.error}
            </div>
          )}
  
          {/* Success state */}
          {result && result.success && (
            <>
              <div className="results-panel__success">
                ✅ {result.rowCount} row(s) returned
              </div>
  
              {result.rows.length === 0 ? (
                <div className="results-panel__empty">
                  Query executed successfully but returned no rows
                </div>
              ) : (
                <div className="results-panel__table-wrapper">
                  <table className="results-panel__table">
                    <thead>
                      <tr>
                        {result.fields.map((field, i) => (
                          <th key={i}>{field}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {result.rows.map((row, i) => (
                        <tr key={i}>
                          {result.fields.map((field, j) => (
                            <td key={j}>
                              {row[field] !== null
                                ? String(row[field])
                                : 'NULL'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
  
        </div>
      </div>
    );
  };
  
  export default ResultsPanel;