import Voice from "./Voice"
import '../style/Footer.css'

const Footer = () => {
    return (
        <div className="footer">
            <hr className="divider" />
            <nav>
                <ul>
                    <Voice value="MARIALETIZIA CRISTINA" path="/" />
                    <Voice value="SERVICES" path="#services" />
                    <Voice value="COME BACKUP" path="#" />
                </ul>
            </nav>
        </div>
    )
}

export default Footer