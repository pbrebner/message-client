import { useState } from "react";

import FriendCard from "./FriendCard";

function AllFriends({ friends, numFriends, setNumFriends }) {
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

    function clearSearch() {
        setFilteredFriends(friends);
        setSearchItem("");
    }

    function clearResults() {
        setFilteredResults([]);
    }

    return (
        <div className="friendsOuterContainer">
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
                    </form>
                    <div className="friendsTitle">
                        All Friends - {friends.length}
                    </div>
                    <div className="friendsDivider"></div>
                    {filteredFriends.length > 0 ? (
                        <div className="friendCardContainer">
                            {filteredFriends.map((friend) => (
                                <FriendCard
                                    key={friend._id}
                                    friend={friend}
                                    numFriends={numFriends}
                                    setNumFriends={setNumFriends}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="friendCardContainer">
                            {friends.map((friend) => (
                                <FriendCard
                                    key={friend._id}
                                    friend={friend}
                                    numFriends={numFriends}
                                    setNumFriends={setNumFriends}
                                />
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
