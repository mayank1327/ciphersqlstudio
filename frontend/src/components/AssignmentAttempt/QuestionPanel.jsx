import { useNavigate } from 'react-router-dom';

const QuestionPanel = ({ assignment }) => {
  const navigate = useNavigate();

  return (
    <div className="question-panel">

      <button
        className="question-panel__back"
        onClick={() => navigate('/')}
      >
        ← Back to Assignments
      </button>

      <div className="question-panel__meta">
        <span className={`question-panel__difficulty
          question-panel__difficulty--${assignment.difficulty}`}>
          {assignment.difficulty}
        </span>
      </div>

      <h2 className="question-panel__title">
        {assignment.title}
      </h2>

      <div className="question-panel__question">
        {assignment.question}
      </div>

    </div>
  );
};

export default QuestionPanel;