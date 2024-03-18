import { useState } from "react";

import "./styles/ChannelSearch.css";

function ChannelSearch({ channels, setFilteredChannels }) {
    const [searchItem, setSearchItem] = useState("");

    function handleSearch(e) {
        setFilteredChannels([]);

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

            setFilteredChannels(filteredItems);
        }
    }

    function clearSearch(e) {
        e.preventDefault();
        setFilteredChannels([]);
        setSearchItem("");
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
                />
                <button className="channelSearchClear" onClick={clearSearch}>
                    &#x2715;
                </button>
            </form>
        </div>
    );
}

export default ChannelSearch;
