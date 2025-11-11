type TitleProps = {
    text: string;
}

function Title({ text }: TitleProps) {
    return <h1 className="title">{text}</h1>;
}

export default Title;
