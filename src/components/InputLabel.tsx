type InputLabelProps = {
    label: string;
    type?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    checked?: boolean;
};

function InputLabel(props: InputLabelProps) {
    const id = `input-${props.label.replace(/\s+/g, '-').toLowerCase()}`;

    if (props.type === 'checkbox') {
        return (
            <div className="form-check">
                <input
                    className="form-check-input"
                    type="checkbox"
                    id={id}
                    checked={props.checked}
                    onChange={props.onChange}
                />
                <label className="form-check-label" htmlFor={id}>
                    {props.label}
                </label>
            </div>
        );
    }

    return (
        <input
            className="form-control"
            id={id}
            placeholder={props.label}
            type={props.type ?? 'text'}
            value={props.value}
            onChange={props.onChange}
            required={props.required}
        />
    );
}

export default InputLabel;
/*        <label>
            {label}
            <input type="text" />
        </label> */