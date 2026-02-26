const Loader = ({ text = 'Loading...' }) => {
    return (
      <div className="loader">
        <div className="loader__spinner"></div>
        <span className="loader__text">{text}</span>
      </div>
    );
  };
  
  export default Loader;