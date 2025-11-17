import '../style/Profession.css';

interface ProfessionProps {
    name: string;
}


const Profession = ({ name }: ProfessionProps) => {
    return (
        <div className="profession">
            <hr />
            <h2>{name}</h2>
            <hr />
        </div>
    )
}

export default Profession;