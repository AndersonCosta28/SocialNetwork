import React, { useState } from "react"
import { NavLink, RouteObject } from "react-router-dom"
import { API_AXIOS } from "../../Providers/axios"
import { getAxiosErrorMessage } from "common"
import FormField from "../../Components/FormField"

enum ScreenForgetPassword {
	"Default",
	"Sucess",
	"Error",
}
const ForgetPassword = () => {
	const [emailUser, setEmailUser] = useState<string>("")
	const [currentComponent, setCurrentComponent] = useState<ScreenForgetPassword>(ScreenForgetPassword.Default)
	const [errorMessage, setErrorMessage] = useState<string>("")
	const [disableButton, setDisableButton] = useState<boolean>(false)

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setDisableButton(true)
		API_AXIOS.post("/user/sendRedefinePasswordEmail", { emailUser: emailUser.toLowerCase() })
			.then(() => setCurrentComponent(ScreenForgetPassword.Sucess))
			.catch((error) => {
				setErrorMessage(getAxiosErrorMessage(error))
				setCurrentComponent(ScreenForgetPassword.Error)
			})
			.finally(() => setDisableButton(false))
	}

	const handlerEmailUser = (e: React.ChangeEvent<HTMLInputElement>) => setEmailUser(e.target.value)

	const Sucess = () => (
		<div>
			<h1>email sent check your inbox or spam</h1>
		</div>
	)
	const Error = () => (
		<div>
			<h1>{errorMessage}</h1>
		</div>
	)
	const Default = () => (
		<form onSubmit={onSubmit} className="form">
			<h2>Forget Password</h2>
			<br />
			<h3>Enter email to have a password reset email sent</h3>
			<FormField type="email" id="email" label="Email" onChange={handlerEmailUser} invalidMessages={[]} />
			<div className="form__options">
				<input className="form__options__buttonSubmit" type="submit" value="Send" disabled={disableButton || emailUser.length === 0} />
			</div>
		</form>
	)

	return (
		<div className="page">
			<div className="page__header">
				<NavLink to={"/"}>Back</NavLink>
			</div>
			<div className="page__body">{(currentComponent === ScreenForgetPassword.Default && Default()) || (currentComponent === ScreenForgetPassword.Error && Error()) || (currentComponent === ScreenForgetPassword.Sucess && Sucess())}</div>
			<div className="page__footer"></div>
		</div>
	)
}

export default ForgetPassword

export const ForgetPasswordRoute: RouteObject = {
	element: <ForgetPassword />,
	path: "/forgetpassword",
}
