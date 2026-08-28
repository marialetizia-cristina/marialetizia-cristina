import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GiftArt = () => {
    const navigate = useNavigate();
    useEffect(() => {
        navigate("/idee-regalo/", { replace: true });
    }, [navigate]);
    return null;
};

export default GiftArt;
