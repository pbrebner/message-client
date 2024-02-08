import loadingBtn from "../assets/icons/loadingBtn.svg";
import "./styles/Button.css";

const Button = ({ styleRef, onClick, text, loading, disabled }) => {
    return (
        <button
            className={`submitBtn ${styleRef}`}
            onClick={onClick}
            disabled={disabled}
        >
            {!loading ? (
                text
            ) : (
                <div className="submitBtnLoading">
                    <p>{text}</p>
                    <img src={loadingBtn} alt="loader" className="spinner" />
                </div>
            )}
        </button>
    );
};

export default Button;
