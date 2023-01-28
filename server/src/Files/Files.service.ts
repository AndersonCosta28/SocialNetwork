import { Repository } from "typeorm"
import Files from "./Files.entity"

export interface IFilesService {
	changeAvatar: (id: number, buffer: Buffer, type: string) => Promise<void>
}

export default class FilesService {
	constructor(private readonly repository: Repository<Files>) { }
	changeAvatar = async (id: number, buffer: Buffer, type: string) => {
		await this.repository.update(id, { buffer, type })
	}
}