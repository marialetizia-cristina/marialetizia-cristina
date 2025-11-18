import Voice from "./Voice"
import '../style/Footer.css'

const Footer = () => {
    return (
        <div className="footer">
            <hr className="divider" />
            <nav>
                <ul>
                    <Voice value="MARIALETIZIA CRISTINA" path="/" />
                    <Voice value="BACK TO TOP" path="#top" />
                </ul>
            </nav>
        </div>
    )
}

export default Footer