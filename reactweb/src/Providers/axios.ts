import axios from "axios"
import { io } from "socket.io-client"
import { getIsAuthenticated, getIWS, getNickname, getToken, getUserId } from "utils"

export const connectToServerWebSocket = () =>
	io("http://localhost:3001", {
		auth: { authenticated: getIsAuthenticated() },
		query: {
			Nickname: getNickname(),
			UserId: getUserId(),
		},
	})

export const BASE_URL_API_V1 = "http://localhost:3001/api/v1/"
export const API_AXIOS = axios.create({
	baseURL: BASE_URL_API_V1
})

API_AXIOS.interceptors.request.use((config) => {
	console.log("iws -> " + getIWS())
	config.headers.Authorization = getToken()
	config.headers["iws"] = getIWS()
	return config
})