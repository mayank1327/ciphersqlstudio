import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AssignmentCard from './AssignmentCard';
import Loader from '../shared/Loader';
import { getAllAssignments } from '../../services/assignmentService';

const FILTERS = ['All', 'Easy', 'Medium', 'Hard'];

const AssignmentList = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await getAllAssignments();
        setAssignments(response.data);
      } catch (err) {
        setError('Failed to load assignments. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  // Filter assignments based on active filter
  const filtered = activeFilter === 'All'
    ? assignments
    : assignments.filter(a => a.difficulty === activeFilter);

  if (loading) return <Loader text="Loading assignments..." />;

  if (error) return (
    <div className="assignments-page">
      <div className="results-panel__error">{error}</div>
    </div>
  );

  return (
    <div className="assignments-page">

      <div className="assignments-page__header">
        <h1>SQL Assignments</h1>
        <p>Practice SQL queries with real-time execution and AI hints</p>
      </div>

      {/* Difficulty filters */}
      <div className="assignments-page__filters">
        {FILTERS.map(filter => (
          <button
            key={filter}
            className={`filter-btn ${activeFilter === filter
              ? 'filter-btn--active' : ''}`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Assignment grid */}
      {filtered.length === 0 ? (
        <p style={{ color: '#64748b' }}>
          No assignments found for this filter.
        </p>
      ) : (
        <div className="assignments-page__grid">
          {filtered.map(assignment => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              onClick={() => navigate(`/attempt/${assignment.id}`)}
            />
          ))}
        </div>
      )}

    </div>
  );
};

export default AssignmentList;