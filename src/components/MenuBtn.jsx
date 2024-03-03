import "./styles/MenuBtn.css";

function MenuBtn({ openSidebar }) {
    return (
        <button onClick={openSidebar} className="menuBtn">
            <div className="menuLayer"></div>
            <div className="menuLayer"></div>
            <div className="menuLayer"></div>
        </button>
    );
}

export default MenuBtn;
