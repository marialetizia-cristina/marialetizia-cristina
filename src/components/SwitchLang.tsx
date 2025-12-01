import { useState } from "react";
import "../style/SwitchLang.css";

const SwitchLang = () => {
    const [lang, setLang] = useState<"EN" | "IT">("EN");

    const toggleLang = (selectedLang: "EN" | "IT") => {
        setLang(selectedLang);
        
    };

    const mainSwitchLangButton = () => {
        if (lang === "EN") {
            return (
                <button className="switch-lang__button" onClick={() => toggleLang("IT")}>
                    IT
                </button>
            );
        } else {
            return (
                <button className="switch-lang__button" onClick={() => toggleLang("EN")}>
                    EN
                </button>
            );
        }
    };

    return (
        <div className="switch-lang">
            {mainSwitchLangButton()}
        </div>
    );
}

export default SwitchLang;