const AssignmentCard = ({ assignment, onClick }) => {
    return (
      <div className="assignment-card" onClick={onClick}>
  
        <div className="assignment-card__header">
          <span className={`assignment-card__difficulty 
            assignment-card__difficulty--${assignment.difficulty}`}>
            {assignment.difficulty}
          </span>
        </div>
  
        <h3 className="assignment-card__title">
          {assignment.title}
        </h3>
  
        <p className="assignment-card__description">
          {assignment.description}
        </p>
  
        <div className="assignment-card__footer">
          <button className="assignment-card__solve-btn">
            Solve →
          </button>
        </div>
  
      </div>
    );
  };
  
  export default AssignmentCard;