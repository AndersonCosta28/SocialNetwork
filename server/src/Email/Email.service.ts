import { Repository } from "typeorm"
import Email from "./Email.entity"
import nodemailer, { Transporter } from "nodemailer"
import SMTPTransport from "nodemailer/lib/smtp-transport"
import { EmailTypes, IEmailMessage } from "common/Types/Email"
import User from "User/User.entity"
import { v4 as uuid4 } from "uuid"
import { CustomErrorAPI, addHours } from "common"

export interface IEmailService {
	sendMail: (emailMessage: IEmailMessage) => Promise<void>
	prepareActivationEmail: (user: User) => { newEmail: Email, emailMessage: IEmailMessage }
	prepareRedefinePasswordEmail: (user: User) => { newEmail: Email, emailMessage: IEmailMessage }
	createEmailForSave: (user: User, emailType: EmailTypes, uuidEmail: string, EmailContent: string) => Email
	create: (model: Email) => Promise<Email>
	findOneByUUIDAndType: (uuid: string, type: EmailTypes) => Promise<Email | null>
	findOneByIdUserAndType: (idUser: number, type: EmailTypes) => Promise<Email | null>
	checkEmailRedefinePassword: (uuid: string) => Promise<void>
}

export default class EmailService implements IEmailService {
	constructor(private readonly repository: Repository<Email>, private readonly transporter: Transporter<SMTPTransport.SentMessageInfo>) { }

	testAccount = async () => await nodemailer.createTestAccount()

	sendMail = async (emailMessage: IEmailMessage): Promise<void> => {
		const info = await this.transporter.sendMail({
			from: `\"${emailMessage.from.name}\" ${emailMessage.from.name}`, // sender address
			to: emailMessage.to.email, // list of receivers
			subject: emailMessage.subject, // Subject line
			text: emailMessage.text, // plain text body
			html: emailMessage.html, // html body
		})

		console.log("Message sent: %s", info.rejected)
	}

	prepareActivationEmail = (user: User): { newEmail: Email, emailMessage: IEmailMessage } => {
		if (process.env.EMAILSERVICE_EMAILTOSEND_NAME === undefined || process.env.EMAILSERVICE_EMAILTOSEND_EMAIL === undefined)
			throw new CustomErrorAPI("Email or username sender information is missing", 500)

		const uuid = uuid4()
		const url = `http://localhost:3000/user/activation/${uuid}`

		const emailMessage: IEmailMessage = {
			from: {
				name: process.env.EMAILSERVICE_EMAILTOSEND_NAME,
				email: process.env.EMAILSERVICE_EMAILTOSEND_EMAIL
			},
			to: {
				name: user.Login,
				email: user.Email
			},
			text: `This is your activation url => ${url}`,
			subject: "Activation email",
			html: `<p>This is your activation link => <a href="${url}" target="_blank" >activate</a></p>`
		}

		return { newEmail: this.createEmailForSave(user, EmailTypes.Activation, uuid, emailMessage.html), emailMessage }
	}

	prepareRedefinePasswordEmail = (user: User): { newEmail: Email, emailMessage: IEmailMessage } => {
		if (process.env.EMAILSERVICE_EMAILTOSEND_NAME === undefined || process.env.EMAILSERVICE_EMAILTOSEND_EMAIL === undefined)
			throw new CustomErrorAPI("Email or username sender information is missing", 500)

		const uuid = uuid4()
		const url = `http://localhost:${Number(process.env.PORT_CLIENT)}/user/redefinepassword/${uuid}`

		const emailMessage: IEmailMessage = {
			from: {
				name: process.env.EMAILSERVICE_EMAILTOSEND_NAME,
				email: process.env.EMAILSERVICE_EMAILTOSEND_EMAIL
			},
			to: {
				name: user.Login,
				email: user.Email
			},
			text: `This is your password reset url => ${url}`,
			subject: "Password reset email",
			html: `<p>This is your password reset link => <a href="${url}" target="_blank" >Redefine password</a></p>`
		}

		return { newEmail: this.createEmailForSave(user, EmailTypes.RedefinePassword, uuid, emailMessage.html), emailMessage }
	}

	createEmailForSave = (user: User, emailType: EmailTypes, uuidEmail: string, EmailContent: string): Email =>
		this.repository.create({
			content: EmailContent,
			idEmail: uuidEmail,
			user: user,
			ExpiresAt: String(addHours(new Date(), 1).getTime()),
			type: emailType
		})

	create = async (model: Email): Promise<Email> => {
		const modelCreated = this.repository.create(model)
		return await this.repository.save(modelCreated)
	}

	findOneByUUIDAndType = async (uuid: string, type: EmailTypes): Promise<Email | null> => {
		const result = await this.repository.findOneBy({ idEmail: uuid, type: type.toString() })
		return result
	}

	findOneByIdUserAndType = async (idUser: number, type: EmailTypes): Promise<Email | null> => {
		const result = await this.repository.findOneBy({
			user: { id: idUser },
			type: type.toString()
		})
		return result
	}

	checkEmailRedefinePassword = async (uuid: string): Promise<void> => {
		const email: Email | null = await this.findOneByUUIDAndType(uuid, EmailTypes.RedefinePassword)
		if (!email) throw new CustomErrorAPI("Email not found", 404)
		if (Number(email.ExpiresAt) < new Date().getTime()) throw new CustomErrorAPI("The email has expired")
	}
}