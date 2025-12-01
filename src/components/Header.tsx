import Voice from "./Voice"
import SwitchLang from "./SwitchLang"
import '../style/Header.css'

const Header = () => {
    return (
        <div className="header">
            <nav>
                <ul>
                    <Voice value="WORKS" path="#works" />
                    <Voice value="ABOUT" path="#about" />
                    <Voice value="SERVICES" path="#services" />
                    <Voice value="CONTACT" path="#contact" />
                    <SwitchLang />
                </ul>
            </nav>
            <hr className="divider" />
        </div>
    )
}

export default Header