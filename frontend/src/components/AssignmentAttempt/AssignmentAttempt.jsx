import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import QuestionPanel from './QuestionPanel';
import SampleDataViewer from './SampleDataViewer';
import SqlEditor from './SqlEditor';
import ResultsPanel from './ResultsPanel';
import HintPanel from './HintPanel';
import Loader from '../shared/Loader';
import { getAssignmentById } from '../../services/assignmentService';
import { executeQuery } from '../../services/queryService';
import { getHint } from '../../services/hintService';

const AssignmentAttempt = () => {
  const { id } = useParams();

  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sqlQuery, setSqlQuery] = useState('-- Write your SQL query here\n');
  const [result, setResult] = useState(null);
  const [executing, setExecuting] = useState(false);
  const [hint, setHint] = useState(null);
  const [hintLoading, setHintLoading] = useState(false);

  // Fetch assignment on mount
  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const response = await getAssignmentById(id);
        setAssignment(response.data);
      } catch (err) {
        console.error('Failed to load assignment:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignment();
  }, [id]);

  // Execute SQL query
  const handleExecute = async () => {
    if (!sqlQuery.trim()) return;

    setExecuting(true);
    setResult(null);

    try {
      const response = await executeQuery(id, sqlQuery);
      setResult(response);
    } catch (err) {
      setResult({
        success: false,
        error: err.response?.data?.error || 'Failed to execute query'
      });
    } finally {
      setExecuting(false);
    }
  };

  // Get hint from LLM
  const handleHint = async () => {
    setHintLoading(true);
    setHint(null);

    try {
      const response = await getHint(id, sqlQuery);
      setHint(response.hint);
    } catch (err) {
      setHint('Could not generate hint. Please try again.');
    } finally {
      setHintLoading(false);
    }
  };

  if (loading) return <Loader text="Loading assignment..." />;
  if (!assignment) return (
    <div style={{ padding: '24px', color: '#ef4444' }}>
      Assignment not found
    </div>
  );

  return (
    <div className="attempt-page">

      {/* Left Panel */}
      <div className="attempt-page__left">
        <QuestionPanel assignment={assignment} />
        <SampleDataViewer sampleTables={assignment.sampleTables} />
      </div>

      {/* Right Panel */}
      <div className="attempt-page__right">
        <SqlEditor
          value={sqlQuery}
          onChange={setSqlQuery}
          onExecute={handleExecute}
          onHint={handleHint}
          executing={executing}
          hintLoading={hintLoading}
        />

        <HintPanel
          hint={hint}
          loading={hintLoading}
        />

        <ResultsPanel
          result={result}
          loading={executing}
        />
      </div>

    </div>
  );
};

export default AssignmentAttempt;