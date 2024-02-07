import { useRouteError } from "react-router-dom";

import "./styles/ErrorPage.css";

function ErrorPage() {
    const error = useRouteError();

    return (
        <div className="errorPage">
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
                <i>{error.statusText || error.message}</i>
            </p>
        </div>
    );
}

export default ErrorPage;
