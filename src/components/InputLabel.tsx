type InputLabelProps = {
    label: string;
    type?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
};

function InputLabel(props: InputLabelProps) {
    return (
        <>
        <input className="form-control" 
        id="formGroupExampleInput" 
        placeholder={props.label} 
        type={props.type} 
        value={props.value} 
        onChange={props.onChange} 
        required={props.required} />
        </>
    );
}

export default InputLabel;
/*        <label>
            {label}
            <input type="text" />
        </label> */