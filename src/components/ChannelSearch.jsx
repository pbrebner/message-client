import { useState } from "react";
import { Link } from "react-router-dom";

import "./styles/ChannelSearch.css";

function ChannelSearch({ channels }) {
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchItem, setSearchItem] = useState("");
    const [filteredResults, setFilteredResults] = useState([]);

    function handleSearch(e) {
        setFilteredResults([]);

        const searchTerm = e.target.value;
        setSearchItem(searchTerm);

        if (searchTerm) {
            const filteredItems = channels.filter(
                (channel) =>
                    channel.title
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    channel.users.find((user) =>
                        user.name
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase())
                    )
            );

            setFilteredResults(filteredItems);
        }
    }

    function clearSearch() {
        setFilteredResults([]);
        setSearchItem("");
        setSearchOpen(false);
    }

    function clearResults() {
        setFilteredResults([]);
        setSearchOpen(false);
    }

    return (
        <div className="channelSearchContainer">
            <form className="channelSearchForm">
                <input
                    type="text"
                    name="channelSearch"
                    id="channelSearch"
                    className="channelSearch"
                    placeholder="Find a conversation"
                    value={searchItem}
                    onChange={handleSearch}
                    autoComplete="off"
                    onFocus={() => setSearchOpen(true)}
                />
            </form>
            {filteredResults.length > 0 && (
                <div className="searchResults">
                    {filteredResults.map((channel) => (
                        <Link
                            to={`./${channel._id}`}
                            key={channel._id}
                            className="searchResult"
                            onClick={clearSearch}
                        >
                            {channel.title || channel.users[0].name}
                        </Link>
                    ))}
                </div>
            )}
            <div
                className={`overlay ${searchOpen ? "display" : ""}`}
                onClick={clearResults}
            ></div>
        </div>
    );
}

export default ChannelSearch;
