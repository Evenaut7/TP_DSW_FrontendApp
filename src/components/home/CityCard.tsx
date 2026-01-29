import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../../utils/api';

interface CityCardProps {
  id: number;
  nombre: string;
  imagen: string;
}

export default function CityCard({ id, nombre, imagen }: CityCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/localidad/${id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="group relative aspect-[4/3] rounded-3xl overflow-hidden city-card-hover cursor-pointer"
    >
      <img
        alt={nombre}
        className="w-full h-full object-cover"
        src={getImageUrl(imagen)}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-center justify-center group-hover:from-primary/80 transition-all duration-500">
        <h3 className="text-white text-4xl font-extrabold tracking-tight drop-shadow-md">
          {nombre}
        </h3>
      </div>
    </div>
  );
}
