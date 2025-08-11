type InputLabelProps = {
    label: string;
};

function InputLabel(props: InputLabelProps) {
    return (
        <>
        <input type="text" className="form-control" id="formGroupExampleInput" placeholder={props.label} />
        </>
    );
}

export default InputLabel;
/*        <label>
            {label}
            <input type="text" />
        </label> */