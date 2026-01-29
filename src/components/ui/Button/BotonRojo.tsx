import Button from 'react-bootstrap/Button';

type BotonRojoProps = {
    texto: string;
};

function BotonRojo(props: BotonRojoProps) {
    return (
        <Button variant="outline-danger">{props.texto}</Button>
    );
};

export default BotonRojo;
