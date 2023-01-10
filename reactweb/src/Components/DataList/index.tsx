import React from "react"
import { AiOutlineSearch } from "react-icons/ai"
import styles from "./DataList.module.css"
import { IoPerson } from "react-icons/io5"
import { IUserInfo } from "common/Types/User"
import { API_AXIOS } from "../../Providers/axios"
import { toast } from "react-hot-toast"
import { getAxiosErrorMessage } from "common"

const index = () => {
	const [textSearch, setTextSearch] = React.useState<string>("")
	const ListOfItemsElementRef = React.useRef<HTMLUListElement>(null)
	const [allUsers, setAllUsers ] = React.useState<IUserInfo[]>([])
	const ListItems: IUserInfo[] = allUsers.filter((item: IUserInfo) => item.Nickname.toLowerCase().includes(textSearch.toLowerCase()))

	React.useEffect(() => {
		API_AXIOS("/user")
			.then(res => setAllUsers(res.data))
			.catch(error => toast.error(getAxiosErrorMessage(error)))
	}, [])

	const handlerTextSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target
		setTextSearch(value)
	}

	return (
		<div id={styles.searchBar}>
			<AiOutlineSearch id={styles.searchBar__icon} />
			<input type="search" list="data" name="" className={`shadow_white`} onChange={handlerTextSearch} />
			{textSearch.trim().length > 0 ? (
				<ul id={styles.searchBar__list} ref={ListOfItemsElementRef} className="shadow_white">
					{ListItems.map((item: IUserInfo, index: number, array) => (
						<li key={`${index + 1}/${array.length}-itemFinded`}>
							<IoPerson size={30} />
							<span>{item.Nickname}</span>
						</li>
					))}
				</ul>
			) : null}
		</div>
	)
}

export default index
