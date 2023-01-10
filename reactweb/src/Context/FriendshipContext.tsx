import React, { createContext, useContext } from "react"

const FriendshipContext = createContext(null)

export const FriendshipProvider = ({ children }: { children: React.ReactNode }) => 
// const addFriend = () => {}

// const removeFriend = () => {}

// const acceptFriendshipRequest = () => {}

// const rejectFriendshipRequest = () => {}

	 <FriendshipContext.Provider value={null}>{children}</FriendshipContext.Provider>


// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const useFriendship = () => useContext(FriendshipContext)!
