import Navbar from '@/components/layout/Navbar.tsx';

type Mensaje = {
  mensaje: string;
};

const PantallaDeCarga: React.FC<Mensaje> = ({ mensaje }) => {
  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 gap-6">
        <div className="flex flex-col items-center gap-4 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-xl px-12 py-10">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-gray-700 font-medium text-lg tracking-wide">
            Cargando {mensaje}...
          </p>
        </div>
      </div>
    </>
  );
};

export default PantallaDeCarga;