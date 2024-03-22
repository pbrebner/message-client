import { useState } from "react";

import FriendCard from "./FriendCard";

function AllFriends({ friends, numFriends, setNumFriends, pageLoading }) {
    const [searchItem, setSearchItem] = useState("");
    const [filteredFriends, setFilteredFriends] = useState([]);

    function handleSearch(e) {
        const searchTerm = e.target.value;
        setSearchItem(searchTerm);

        if (searchTerm) {
            const filteredItems = friends.filter((friend) =>
                friend.targetUser.name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
            );

            setFilteredFriends(filteredItems);
        } else {
            setFilteredFriends([]);
        }
    }

    function clearSearch(e) {
        e.preventDefault();
        setFilteredFriends([]);
        setSearchItem("");
    }

    return (
        <div className="friendsOuterContainer">
            {pageLoading && (
                <div className="friendLoader">
                    <div className="friendLoaderSearch"></div>
                    <div className="friendLoaderHeader"></div>
                    <div className="friendsDivider"></div>
                    <div className="friendLoaderCard"></div>
                    <div className="friendLoaderCard"></div>
                    <div className="friendLoaderCard"></div>
                </div>
            )}
            {friends && friends.length > 0 ? (
                <div className="friendsContainer">
                    <form className="friendSearchForm">
                        <input
                            type="text"
                            name="friendSearch"
                            id="friendSearch"
                            className="friendSearch"
                            placeholder="Search by name."
                            value={searchItem}
                            onChange={handleSearch}
                            autoComplete="off"
                        />
                        <button
                            className="friendSearchClear"
                            onClick={clearSearch}
                        >
                            &#x2715;
                        </button>
                    </form>
                    <div className="friendsTitle">
                        All Friends - {friends.length}
                    </div>
                    <div className="friendsDivider"></div>
                    {filteredFriends.length > 0 ? (
                        <div className="friendCardContainer">
                            {filteredFriends.map((friend) => (
                                <FriendCard key={friend._id} friend={friend} />
                            ))}
                        </div>
                    ) : (
                        <div className="friendCardContainer">
                            {friends.map((friend) => (
                                <FriendCard key={friend._id} friend={friend} />
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <div className="friendsContainer">
                    You don't have any friends yet.
                </div>
            )}
        </div>
    );
}

export default AllFriends;
