import React from "react"
import { AiOutlineSearch } from "react-icons/ai"
import styles from "./DataList.module.css"
import { IoPerson } from "react-icons/io5"
import { IProfileInfo } from "common/Types/User"
import { useNavigate } from "react-router-dom"
import { getUserId } from "utils"
import { useProtected } from "Context/ProtectedContext"

const index = () => {
	const [textSearch, setTextSearch] = React.useState<string>("")
	const { allProfiles } = useProtected()
	const ListOfItemsElementRef = React.useRef<HTMLUListElement>(null)
	const navigate = useNavigate()
	const [searchBarIsFocused, setSearchBarIsFocused] = React.useState<boolean>(false)
	const ListItems: IProfileInfo[] = allProfiles.filter((item: IProfileInfo) => item.Nickname.toLowerCase().includes(textSearch.toLowerCase())).filter((value) => Number(value.id) !== Number(getUserId()))
	const LiElementResults = () => (
		ListItems.length > 0 ? 
			ListItems
				.map((item: IProfileInfo, index: number, array) => (
					<li key={`${index + 1}/${array.length}-itemFinded`} onClick={() => navigateToProfile(item)}>
						<IoPerson size={30} />
						<span>{item.Nickname}</span>
					</li>))
			: 
			<li>
				<span>Nenhum resultado encontrado</span>
			</li>
	)

	const handlerTextSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target
		setTextSearch(value)
	}

	const navigateToProfile = (userInfo: IProfileInfo) => {
		navigate("/profile/" + userInfo.Nickname)
		setTextSearch("")
	}

	const ResultSearch = () => { 
		if (!searchBarIsFocused) 
			return null

		if (textSearch.trim().length > 0)
			return (
				<ul id={styles.searchBar__list} ref={ListOfItemsElementRef} className="shadow_white">
					{LiElementResults()}
				</ul>
			)
		
		else return null
	}

	return (
		<div id={styles.searchBar} >
			<AiOutlineSearch id={styles.searchBar__icon} />
			<input type="search" list="data" className={`shadow_white`} onChange={handlerTextSearch} value={textSearch} onBlur={() => setTimeout(() => setSearchBarIsFocused(false), 100)} onFocus={() => setSearchBarIsFocused(true)} />
			<ResultSearch />
		</div>
	)
}

export default index
