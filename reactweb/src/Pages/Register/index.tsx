import React, { useReducer, useState } from "react"
import { RouteObject, useNavigate } from "react-router-dom"
import { IUserRegister } from "common/Types/User"
import { useAuth } from "../../Context/AuthContext"
import styles from "./register.module.css"
import FormField from "../../Components/FormField"
import { regexPassword } from "common"

type FormError = {
	Nickname: {
		isDuplicated: boolean
		containsSpace: boolean
		minimumLength: boolean
	}
	Password: {
		regex: boolean
	}
	ConfirmPassword: {
		matchPassword: boolean
	}
	Email: {
		isDuplicated: boolean
	}
}

const formErrorInitialValue = {
	Nickname: { containsSpace: false, isDuplicated: false, minimumLength: false },
	Password: { regex: false },
	ConfirmPassword: { matchPassword: false },
	Email: { isDuplicated: false },
}

enum ErrorsFromAPI {
	DuplicatedField,
}

type ActionFormError = {
	field: string
	fromApi: { type: ErrorsFromAPI; message: string } | null
}

const FIELDS = {
	NICKNAME: "Nickname",
	PASSWORD: "Password",
	CONFIRM_PASSWORD: "ConfirmPassword",
	EMAIL: "Email",
}

const Register = () => {
	//#region Aux functions

	const verifyDuplicateField = (valueDuplicate: string, field: string): boolean =>
		!!Object.entries(user).find((_field) => {
			const [key, value] = _field
			return value === valueDuplicate && key === field
		})

	//#endregion

	//#region Hooks
	const navigate = useNavigate()
	const [user, setUser] = useState<IUserRegister>({
		Login: "",
		Email: "",
		Nickname: "",
		Password: "",
	})

	const [confirmPassword, setConfirmPassword] = useState<string>("")
	const { createAccount, disableButton } = useAuth()

	const reducer = (oldState: FormError, action: ActionFormError): FormError => {
		const { field, fromApi } = action
		if (field === FIELDS.NICKNAME)
			return {
				...oldState,
				Nickname: {
					containsSpace: /\s/g.test(user.Nickname),
					minimumLength: user.Nickname.split(" ").join("").length <= 5,
					isDuplicated: false,
				},
			}
		else if (field === FIELDS.PASSWORD) return { ...oldState, Password: { regex: !regexPassword.test(user.Password) } }
		else if (field === FIELDS.CONFIRM_PASSWORD) return { ...oldState, ConfirmPassword: { matchPassword: user.Password !== confirmPassword } }
		else if (fromApi)
			return {
				...oldState,
				Nickname: {
					...oldState.Nickname,
					isDuplicated: verifyDuplicateField(fromApi.message, FIELDS.NICKNAME),
				},
				Email: {
					...oldState.Email,
					isDuplicated: verifyDuplicateField(fromApi.message, "Email"),
				},
			}

		return oldState
	}

	const [formError, dispatchFormError] = useReducer(reducer, formErrorInitialValue)

	//#endregion

	//#region Callbacks
	const handlerConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
		setConfirmPassword(e.target.value)
		dispatchFormError({ field: FIELDS.CONFIRM_PASSWORD, fromApi: null })
	}

	const handlerUser = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { id, value } = e.target
		setUser((prevState: IUserRegister) => ({ ...prevState, [id]: value }))
		console.log(id)
		dispatchFormError({ field: id, fromApi: null })
	}

	const callbackSucess = (data: string): void => {
		console.log(data)
	}

	const callbackError = (errorMessage: string): void => {
		console.log(errorMessage)
		const regexDuplicate = /Duplicate entry '(.*?)' for key/
		const resultRegexDuplicate = regexDuplicate.exec(errorMessage)

		if (resultRegexDuplicate) dispatchFormError({ field: "", fromApi: { type: ErrorsFromAPI.DuplicatedField, message: resultRegexDuplicate[1] } })
	}

	const onSubmitForm = (e: React.FormEvent<HTMLFormElement>) => createAccount(e, user, callbackSucess, callbackError)
	//#endregion

	return (
		<div className="page">
			<div className="page__header"></div>
			<div className="page__body">
				<form className="form" autoComplete="off" onSubmit={onSubmitForm}>
					<FormField
						onChange={handlerUser}
						autoComplete="nickname"
						type="text"
						id={FIELDS.NICKNAME}
						label={FIELDS.NICKNAME}
						invalidMessages={[
							{ isInvalid: formError.Nickname.containsSpace, message: "Cannot contain spaces" },
							{ isInvalid: formError.Nickname.minimumLength, message: "Must have at least 5 digits" },
							{ isInvalid: formError.Nickname.isDuplicated, message: "A user with that nickname already exists" },
						]}
					/>
					<FormField
						onChange={handlerUser}
						autoComplete="new-password"
						type="password"
						id={FIELDS.PASSWORD}
						label={FIELDS.PASSWORD}
						invalidMessages={[{ message: "Password does not match the regex", isInvalid: formError.Password.regex }]}
						onBlur={() => dispatchFormError({ field: FIELDS.PASSWORD, fromApi: null })}
					/>
					<FormField
						label="Confirm Password"
						id={FIELDS.CONFIRM_PASSWORD}
						autoComplete="new-password"
						onChange={handlerConfirmPassword}
						type="password"
						invalidMessages={[{ message: "Passwords do not match", isInvalid: formError.ConfirmPassword.matchPassword }]}
					/>
					<FormField label={FIELDS.EMAIL} id={FIELDS.EMAIL} type="email" onChange={handlerUser} invalidMessages={[{ isInvalid: formError.Email.isDuplicated, message: "A user with that email already exists" }]} />
					<div className="form__options">
						<input type="submit" value="Create account" className="form__options__buttonSubmit" disabled={disableButton} />
					</div>
				</form>
			</div>
			<div className="page__footer flex_row_center_center">
				<span className={styles.signin__text}>You already have an account?</span>
				<input className={styles.signin_button} type="button" value="Sign in" onClick={() => navigate("/login")} />
			</div>
		</div>
	)
}

export const RegisterRoute: RouteObject = {
	path: "/register",
	element: <Register />,
}

export default Register
