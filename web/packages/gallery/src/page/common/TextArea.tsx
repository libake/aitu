import { useState } from "react"

interface IProps {
    placeholder?: string;
    onChange?: Function;
    name: string;
    value?: string;
}

export function TextArea(props: IProps) {
    let [value, setValue] = useState(props.value);

    const handlerChange = (evt: any) => {
        setValue(evt.target.value);
        console.log(value, '-----')
        if (!props.onChange) {
            return;
        }
        props.onChange(value);
    }

    return <>
    <textarea
        name={props.name}
        onChange={(e) => handlerChange(e)}
        defaultValue={props.value}
        placeholder={props.placeholder}
    >{value}</textarea>
    </>
}