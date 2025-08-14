import Button from 'react-bootstrap/Button';

type BotonProps = {
    texto: string;
    className?: string;
};

function BotonCel({ texto, className }: BotonProps) {
    return (
        <Button variant="info" className={className}>{texto}</Button>
    );
}

export default BotonCel;
