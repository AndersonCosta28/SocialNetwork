import React, { useState, useEffect } from "react"
import { LoaderFunctionArgs, NavLink, RouteObject } from "react-router-dom"
import { API_AXIOS } from "Providers/axios"
import { getAxiosErrorMessage, regexPassword } from "common"
import RedefinePasswordError from "./RedefinePasswordError"
import FormField from "Components/FormField"

type Passwords = {
	password: string
	confirmPassword: string
}

type FormError = {
	Password: boolean
	ConfirmPassword: boolean
}

enum ScreenRedefinePassword {
	"Default",
	"Sucess",
	"Error",
}

const RedefinePassword = () => {
	const [formError, setFormError] = useState<FormError>({ ConfirmPassword: false, Password: false })
	const [passwords, setPasswords] = useState<Passwords>({ password: "", confirmPassword: "" })
	const [errorMessage, setErrorMessage] = useState<string>("")
	const [currentComponent, setCurrentComponent] = useState<ScreenRedefinePassword>(ScreenRedefinePassword.Default)
	const [disableButton, setDisableButton] = useState<boolean>(false)

	const pathSplit = location.pathname.split("/")
	const idEmail = pathSplit[pathSplit.length - 1]

	const handlerPasswords = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { id, value } = e.target
		setPasswords((prevState: Passwords) => ({ ...prevState, [id]: value }))
	}

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setDisableButton(true)
		API_AXIOS.post("user/redefinepassword", { newPassword: passwords.password, idemail: idEmail })
			.then(() => setCurrentComponent(ScreenRedefinePassword.Sucess))
			.catch((error) => {
				setErrorMessage(getAxiosErrorMessage(error))
				setCurrentComponent(ScreenRedefinePassword.Error)
			})
			.finally(() => setDisableButton(false))
	}

	const Sucess = () => (
		<div>
			<h1>Password successfully reset</h1>
		</div>
	)

	const Error = () => (
		<div>
			<h1>{errorMessage}</h1>
			<br />
			<Default />
		</div>
	)

	useEffect(() => {
		setFormError((prevState: FormError) => ({
			...prevState,
			ConfirmPassword: passwords.password !== passwords.confirmPassword,
		}))
	}, [passwords])

	const testRegexPassword = () => {
		setFormError((prevState: FormError) => ({ ...prevState, Password: !regexPassword.test(passwords.password) }))
	}

	const Default = () => (
		<form onSubmit={onSubmit}>
			<h4 style={{ textAlign: "center" }}>Redefine password</h4>
			<FormField id="password" type="password" autoComplete="new-password" label="Password" onChange={handlerPasswords} onBlur={testRegexPassword} invalidMessages={[{message: "Password does not match the regex", isInvalid: formError.Password}]} />
			<FormField id="confirmPassword" type="password" autoComplete="new-password" label="Confirm password" onChange={handlerPasswords} invalidMessages={[{message: "Passwords do not match", isInvalid: formError.ConfirmPassword}]} />

			<div className="form__options">
				<button className="form__options__buttonSubmit" type="submit" disabled={disableButton || Object.values(formError).some((element: boolean) => element === true)}>
					Send
				</button>
			</div>
		</form>
	)

	return (
		<div className="page">
			<div className="header">
				<NavLink to={"/"}>Back</NavLink>
			</div>
			<div className="page__body flex_column_center_center">
				{(currentComponent === ScreenRedefinePassword.Default && Default()) || (currentComponent === ScreenRedefinePassword.Error && Error()) || (currentComponent === ScreenRedefinePassword.Sucess && Sucess())}
			</div>
			<div className="footer"></div>
		</div>
	)
}

export default RedefinePassword

export const RedefinePasswordRoute: RouteObject = {
	path: "redefinepassword/:idemail",
	element: <RedefinePassword />,
	loader: async ({ params }: LoaderFunctionArgs) => {
		console.log(params)
		document.title = "Redefine password"
		try {
			await API_AXIOS.post("user/checkredefinepasswordemail", params)
			return null
		}
		catch (error) {
			console.log(error)
			throw new Error(getAxiosErrorMessage(error))
		}
	},
	errorElement: <RedefinePasswordError />,
}
