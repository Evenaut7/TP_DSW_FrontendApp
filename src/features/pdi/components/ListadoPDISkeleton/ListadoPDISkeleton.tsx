import './ListadoPDISkeleton.css';

const ListadoPDISkeleton = () => {
  return (
    <div className="listadoPDIWrapper">
      <div className="divListadoPDI">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="card listado-pdi-card">
            <div className="skeleton skeleton-img" />
            <div className="card-body">
              <div className="skeleton skeleton-title" />
              <div className="skeleton skeleton-text" />
              <div className="skeleton skeleton-button" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListadoPDISkeleton;
