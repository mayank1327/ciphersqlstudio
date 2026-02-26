import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/shared/Navbar';
import AssignmentList from './components/AssignmentList/AssignmentList';
import AssignmentAttempt from './components/AssignmentAttempt/AssignmentAttempt';

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<AssignmentList />} />
        <Route path="/attempt/:id" element={<AssignmentAttempt />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;