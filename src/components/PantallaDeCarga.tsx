type Mensaje = {
  mensaje: string
}

const PantallaDeCarga: React.FC<Mensaje> = ({mensaje}) => {
  return ( 
    <div style={{display: "grid", placeItems: "center", marginTop: "200px"}}>
      <h1>Cargando {mensaje}...</h1>
    </div>
  )};

export default PantallaDeCarga