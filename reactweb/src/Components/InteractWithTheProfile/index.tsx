import React from "react"
import { BsFillPersonPlusFill, BsFillPersonCheckFill, BsFillPersonDashFill } from "react-icons/bs"
import { IFriend, TypeOfFriendship } from "common"
import { useFriendship } from "Context/FriendshipContext"
import { getUserId } from "utils"
import { API_AXIOS } from "Providers/axios"
import { toast } from "react-hot-toast"

const InteractWithTheProfile = (props: { FriendId: number; FriendNickname: string }) => {
	const { addFriend, removeFriend, disableButton } = useFriendship()
	const [friend, setFriend] = React.useState<IFriend | undefined>()

	const onClick = (callback: VoidFunction) => {
		if (!disableButton) {
			callback()
			setTimeout(() => fetchFriend(), 1000)
		}
	}

	React.useEffect(() => {
		fetchFriend()
	}, [])

	const fetchFriend = () =>
		API_AXIOS.post("/friendship", { UserId: getUserId() })
			.then((res) => {
				const friendsArray = res.data as IFriend[]
				setFriend(friendsArray.find((friend: IFriend) => friend.FriendId === props.FriendId))
			})
			.catch((error) => toast.error(error))

            
	return (
		<div>
			{!friend || friend?.Type === TypeOfFriendship.Removed ? <BsFillPersonPlusFill size={30} onClick={() => onClick(() => addFriend(Number(getUserId()), props.FriendNickname))} /> : null}
			{friend?.Type === TypeOfFriendship.Friend ? <BsFillPersonDashFill size={30} onClick={() => onClick(() => removeFriend(friend.FriendshipId))} /> : null}
			{friend?.Type === TypeOfFriendship.Requested ? <BsFillPersonCheckFill size={30} onClick={() => onClick(() => (disableButton ? null : removeFriend(friend.FriendshipId)))} /> : null}
		</div>
	)
}

export default InteractWithTheProfile
