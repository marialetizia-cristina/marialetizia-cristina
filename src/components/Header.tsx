import Voice from "./Voice"
import '../style/Header.css'

function Header() {
    return (
        <>
            <header className="header">
                <nav>
                    <ul>
                        <Voice value="HOME" path="/" />
                        <Voice value="INFO" path="/info" />
                        <Voice value="CONTACT" path="/giftart" />
                    </ul>

                </nav>
                <hr className="divider" />
            </header>
        </>
    )
}

export default Header