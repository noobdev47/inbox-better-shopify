import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export const AuthProvider = ({ children }) => {
	const navigate = useNavigate()

	useEffect(() => {
    if (localStorage.getItem('token') === null) {
			localStorage.clear()
			navigate('/auth/login')
		}
	}, [])

	return <>{children}</>
}
