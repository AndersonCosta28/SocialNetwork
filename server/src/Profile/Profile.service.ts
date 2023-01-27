import { Repository } from "typeorm"
import Profile from "./Profile.entity"

export default class ProfileService {
	constructor(private readonly repository: Repository<Profile>) { }

	edit = async (profile: Profile) => {
		console.log(profile)
	}
}