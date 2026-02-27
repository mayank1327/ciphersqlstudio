const SampleDataViewer = ({ sampleTables }) => {
    if (!sampleTables || sampleTables.length === 0) {
      return null;
    }
  
    return (
      <div className="sample-data">
  
        <div className="sample-data__title">
          Sample Data
        </div>
  
        {sampleTables.map((table, index) => (
          <div key={index}>
  
            <div className="sample-data__table-name">
              📋 {table.tableName}
            </div>
  
            <div className="sample-data__table-wrapper">
              <table className="sample-data__table">
                <thead>
                  <tr>
                    {table.columns.map((col, i) => (
                      <th key={i}>
                        {col.columnName}
                        <span style={{
                          color: '#475569',
                          fontWeight: 400,
                          marginLeft: '4px'
                        }}>
                          ({col.dataType})
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table.rows.map((row, i) => (
                    <tr key={i}>
                      {table.columns.map((col, j) => (
                        <td key={j}>
                          {row[col.columnName] ?? '-'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
  
          </div>
        ))}
  
      </div>
    );
  };
  
  export default SampleDataViewer;