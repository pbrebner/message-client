function AppError({ error }) {
    return (
        <div className="appError">
            <div>
                There was a problem handling your request. Please try again
                later.
            </div>
        </div>
    );
}

export default AppError;
