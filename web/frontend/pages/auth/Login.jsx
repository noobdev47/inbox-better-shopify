import axios from 'axios'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import LoginForm from '../../components/form/login/loginForm'
import { Card, Heading, Layout, Page } from '@shopify/polaris'

const Login = () => {
	const [permanentToken, setPermanentToken] = useState('')
	const [searchParams, setSearchParams] = useSearchParams()

	const hmac = searchParams.get('hmac')
	const shop = searchParams.get('shop')
	const code = searchParams.get('code')
	const state = searchParams.get('state')

	const fetchAccessToken = async () => {
		const response = await axios.post(
			`https://3e34-203-175-73-170.ngrok.io/api/access_token?shop=${shop}&code=${code}`,
			{}
		)

		if (response.access_token) {
			setPermanentToken(response.access_token)
			localStorage.getItem('access_token', response.access_token)
		}
	}

	useEffect(() => {
		if (
			state === 'inboxbetter' &&
			/^[a-zA-Z0-9][a-zA-Z0-9\-]*.myshopify.com/.test(shop) &&
			permanentToken === ''
		)
			fetchAccessToken()
	}, [])

	return (
		<Page fullWidth compactTitle>
			<Layout>
				<Layout.Section>
					<Card sectioned>
						<div style={{ display: 'flex', flexDirection: 'row' }}>
							<div
								style={{
									flexGrow: '1',
									display: 'flex',
									alignItems: 'center',
									flexDirection: 'column',
									justifyContent: 'center',
								}}
							>
								<a
									style={{
										display: 'flex',
										background: 'none',
										alignItems: 'center',
										justifyContent: 'center',
									}}
									href='https://inboxbetter.comocrm.com/'
								>
									<img
										alt='main logo'
										className='img-fluid'
										src='https://inboxclient.comocrm.com/assets/img/logo.png'
									/>
								</a>
								<div
									style={{
										zIndex: '1',
										display: 'flex',
										marginTop: '50px',
										algnItems: 'center',
										position: 'relative',
										justifyContent: 'center',
									}}
								>
									<div
										style={{
											zIndex: -1,
											width: '100%',
											height: '100%',
											borderRadius: '50%',
											position: 'absolute',
											background: '#ABDCFF',
										}}
									></div>
									<img
										className='img-fluid'
										src='https://inboxclient.comocrm.com/assets/img/sign-in.png'
									/>
								</div>
								<div style={{ textAlign: 'center', marginTop: '8%' }}>
									<Heading>
										Use The "Perfect Inbox" AI To Unlock Your Email
										<br />
										Deliverability, While Testing Your Email Creatives &<br />{' '}
										Avoiding The Spam Folder
									</Heading>
								</div>
							</div>
							<div
								style={{
									flexGrow: '1',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
								}}
							>
								<LoginForm />
							</div>
						</div>
					</Card>
				</Layout.Section>
			</Layout>
		</Page>
	)
}

export default Login
