import Voice from "./Voice"
import '../style/Header.css'

const Header = () => {
    return (
        <div className="header">
            <nav>
                <ul>
                    <Voice value="HOME" path="/" />
                    <Voice value="INFO" path="/info" />
                    <Voice value="CONTACT" path="/giftart" />
                </ul>
            </nav>
            <hr className="divider" />
        </div>
    )
}

export default Header