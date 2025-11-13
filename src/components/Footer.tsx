import Voice from "./Voice"
import '../style/Footer.css'

const Footer = () => {
    return (
        <footer className="footer">
            <hr className="divider" />
            <nav>
                <ul>
                    <Voice value="cc" path="/" />
                    <Voice value="ccc" path="/cc" />
                    <Voice value="cccc" path="/ccc" />
                </ul>
            </nav>
        </footer>
    )
}

export default Footer