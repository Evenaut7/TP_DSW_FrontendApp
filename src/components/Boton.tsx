type BotonProps = {
    texto: string;
};

function Boton({ texto }: BotonProps) {
    return (
        <button>{texto}</button>
    );
}


export default Boton;
