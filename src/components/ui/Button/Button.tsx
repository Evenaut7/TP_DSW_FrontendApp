import Button from 'react-bootstrap/Button';

type ButtonProps = {
  texto: string;
  variant?: 'primary' | 'danger' | 'info' | 'outline-danger';
  type?: 'button' | 'submit' | 'reset' | undefined;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
};

function CustomButton({ 
  texto, 
  variant = 'primary', 
  type, 
  disabled, 
  children, 
  className 
}: ButtonProps) {
  // Map variant to appropriate Bootstrap classes
  const variantClass = variant === 'primary' ? 'btn-primary' : '';
  const combinedClassName = `btn ${variantClass} ${className || ''}`.trim();

  return (
    <Button
      variant={variant}
      className={combinedClassName}
      type={type}
      disabled={disabled}
    >
      {texto}
      {children}
    </Button>
  );
}

export default CustomButton;
