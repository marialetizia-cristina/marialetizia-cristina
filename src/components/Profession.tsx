import '../style/Profession.css';

interface ProfessionProps {
    name: string;
}


const Profession = ({ name }: ProfessionProps) => {
    return (
        <div className="profession">
            <div className="divider" />
            <h2>{name}</h2>
            <div className="divider" />
        </div>
    )
}

export default Profession;