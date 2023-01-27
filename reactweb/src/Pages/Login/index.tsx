import React, { useEffect, useState, useRef } from "react"
import styles from "./login.module.css"
import { IUserLogin } from "common/Types/User"
import { useAuth } from "Context/AuthContext"
import { NavLink, RouteObject, useNavigate } from "react-router-dom"
import Typed from "typed.js"
import FormField from "Components/FormField"

const Login = () => {
	const navigate = useNavigate()
	const defaultValue: IUserLogin = { Login: "", Password: "" }
	const [credential, setCredential] = useState<IUserLogin>(defaultValue)
	const { login, disableButton } = useAuth()
	const rigthSideRef = useRef(null)
	const typed = useRef<Typed | null>(null)

	const handlerCredential = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { id, value } = e.target
		setCredential((prevState: IUserLogin) => ({ ...prevState, [id]: value.trim() }))
	}

	const callbackSucess = (data: string) => {
		console.log(data)
		navigate("/")
		navigate(0)
	}

	const callbackError = (errorMessage: string) => {
		console.log(errorMessage)
	}

	const options = {
		strings: [
			`
			<h1>Hello World</h1>
			<h2>Welcome to the open source social network!</h2>
			<h3>Sign up, imagine, have fun and <a href="https://github.com/AndersonCosta28/SocialNetwork">maybe contribute</a></h3>
		`,
		],
		typeSpeed: 50,
		backSpeed: 0,
	}

	useEffect(() => {
		if (rigthSideRef.current) typed.current ??= new Typed(rigthSideRef.current, options)

		return () => {
			typed.current && typed.current.reset()
		}
	}, [rigthSideRef, typed])

	return (
		<div className={styles.page}>
			<div className={styles.page__leftSide}>
				<div className={styles.page__leftSide__header}></div>
				<div className={styles.page__leftSide__body}>
					<h4>Type your credentials to login</h4>
					<form onSubmit={(e) => login(e, credential, callbackSucess, callbackError)} className="form">
						<FormField onChange={handlerCredential} id="Login" label="Login" autoComplete="username" type="text" invalidMessages={[]} />
						<FormField onChange={handlerCredential} id="Password" label="Password" autoComplete="current-password" type="password" invalidMessages={[]} />
						<div className="form__options">
							<input type="submit" value="Sign in" className="form__options__buttonSubmit" disabled={disableButton} />
							<NavLink to={"/forgetpassword"}>Forgot password?</NavLink>
						</div>
					</form>
				</div>
				<div className={styles.page__leftSide__footer}>
					<span className={styles.page__leftSide__footer__signup_text}> Does not have account? </span>
					<input className={styles.page__leftSide__footer__signup_button} type="button" value="Sign up" onClick={() => navigate("/register")} />
				</div>
			</div>
			<div className={styles.page__rigthSide} ref={rigthSideRef}></div>
		</div>
	)
}

export const LoginRoute: RouteObject = {
	path: "/login",
	element: <Login />,
}

export default Login
