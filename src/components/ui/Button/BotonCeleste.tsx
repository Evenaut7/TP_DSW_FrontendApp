import Button from 'react-bootstrap/Button';

type BotonProps = {
  texto: string;
  type?: 'button' | 'submit' | 'reset' | undefined;
  disabled?: boolean;
  children?: React.ReactNode;
};

function BotonCeleste(props: BotonProps) {
  return (
    <Button
      variant="info"
      className="btn btn-primary"
      type={props.type}
      disabled={props.disabled}
    >
      {props.texto}
      {props.children}
    </Button>
  );
}

export default BotonCeleste;
