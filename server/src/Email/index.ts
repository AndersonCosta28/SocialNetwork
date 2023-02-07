import AppDataSource from "Providers/Database/DataSource"
import Email from "./Email.entity"
import EmailService, { IEmailService } from "./Email.service"
import { Repository } from "typeorm"
import nodemailer, { Transporter } from "nodemailer"
import SMTPTransport from "nodemailer/lib/smtp-transport"

const transporter: Transporter<SMTPTransport.SentMessageInfo> = nodemailer.createTransport({
	host: process.env.EMAILSERVICE_EMAILTOSEND_HOST,
	// port:process.env.EMAILSERVICE_EMAILTOSEND_PORT, 
	secure: false,
	auth: {
		user: process.env.EMAILSERVICE_EMAILTOSEND_EMAIL,
		pass: process.env.EMAILSERVICE_EMAILTOSEND_PASSWORD,
	},
	service: process.env.EMAILSERVICE_EMAILTOSEND_SERVICE,
})

const repository: Repository<Email> = AppDataSource.getRepository<Email>(Email)
const emailService: IEmailService = new EmailService(repository, transporter)

export { emailService }