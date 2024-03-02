import "./styles/MenuBtn.css";

function MenuBtn({ openSidebar }) {
    return (
        <div className="menuBtn">
            <button onClick={openSidebar}>Open</button>
        </div>
    );
}

export default MenuBtn;
