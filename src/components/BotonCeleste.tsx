import Button from 'react-bootstrap/Button';

type BotonProps = {
    texto: string;
};

function BotonCel({ texto }: BotonProps) {
    return (
        <Button variant="info">{texto}</Button>
    );
}

export default BotonCel;
