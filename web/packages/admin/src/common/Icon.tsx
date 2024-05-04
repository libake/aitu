type Props = {
    src: string;
    size?: number | string;
    text?: string;
}

export function Icon(props: Props) {

    return <>
        <img src={props.src} style={{width: props.size || "16px", height: props.size || "16px"}} />
        {props.text && <span style={{marginLeft: "8px"}}>{props.text}</span>}
    </>
}