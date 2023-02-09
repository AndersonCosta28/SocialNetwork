import { Repository } from "typeorm"
import Profile from "./Profile.entity"

export interface IProfileService {
	findOneById: (id: number) => Promise<Profile>
	findOneByNickname: (Nickname: string) => Promise<Profile>
	findAll: () => Promise<Profile[]>
	edit: (id: number, profile: Partial<Profile>) => Promise<void>
}

export default class ProfileService implements IProfileService {
	constructor(private readonly repository: Repository<Profile>) { }

	findOneById = async (id: number): Promise<Profile> => {
		const profile: Profile | null = await this.repository.findOne({ where: { id } })
		if (!profile) throw new Error("Profile not found")
		return profile
	}

	findAll = async (): Promise<Profile[]> => await this.repository.find()

	findOneByNickname = async (Nickname: string): Promise<Profile> => {
		const profile = await this.repository
			.createQueryBuilder("profile")
			.innerJoinAndSelect("profile.Avatar", "a")
			.where("LOWER(Nickname) = :nickname", { nickname: Nickname.toLowerCase() })
			.getOne()
		if (!profile) throw new Error("Profile not found")
		return profile
	}

	edit = async (id: number, profile: Partial<Profile>) => {
		await this.repository.update(id, profile)
	}
}