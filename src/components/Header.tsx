import Voice from "./Voice"
import '../style/Header.css'

const Header = () => {
    return (
        <div className="header">
            <nav>
                <ul>
                    <Voice value="INFO" path="#about" />
                    <Voice value="SERVICES" path="#services" />
                    <Voice value="CONTACT" path="#contact" />
                </ul>
            </nav>
            <hr className="divider" />
        </div>
    )
}

export default Header