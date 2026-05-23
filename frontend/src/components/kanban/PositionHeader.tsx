import React from 'react';
import { useNavigate } from 'react-router-dom';

interface PositionHeaderProps {
  title: string;
}

const PositionHeader: React.FC<PositionHeaderProps> = ({ title }) => {
  const navigate = useNavigate();

  return (
    <header className="d-flex align-items-center gap-3 mb-4">
      <button
        type="button"
        className="btn btn-outline-secondary d-inline-flex align-items-center gap-2"
        onClick={() => navigate('/positions')}
      >
        <span aria-hidden="true">←</span>
        Volver a posiciones
      </button>
      <h1 className="h3 mb-0 flex-grow-1">{title}</h1>
    </header>
  );
};

export default PositionHeader;
