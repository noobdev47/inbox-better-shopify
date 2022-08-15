import {
	Card,
	Stack,
	Button,
	Heading,
	TextStyle,
	DisplayText,
} from '@shopify/polaris'
import { Link, useNavigate } from 'react-router-dom'

const Package = ({
	price,
	style,
	options,
	priceId,
	img_src,
	pkg_name,
	duration,
	packageId,
	sequences,
	dnsChecker,
	emailGrader,
	spamChecker,
	subscribing,
	clientSecret,
	email_per_day,
	stripePromise,
	handlePurchase,
	subscriptionId,
	selectedPackageId,
	handleUpgradePlan,
	handleUnsubscription,
	loadingPaymentElements,
	handlePauseSubscription,
	handleResumeSubscription,
	setloadingPaymentElements,
}) => {
	const navigate = useNavigate()

	return (
		<div
			style={{
				borderRadius: '5px',
				border:
					JSON.parse(localStorage.getItem('user')).package === null ||
					JSON.parse(localStorage.getItem('user')).package === undefined
						? ''
						: JSON.parse(localStorage.getItem('user')).package.id === packageId
						? '2px solid #008060'
						: '',
			}}
		>
			<Card sectioned>
				<div
					style={{
						flexGrow: '1',
						width: '450px',
						flex: '0 1 47%',
					}}
				>
					<Card.Header
						title={
							pkg_name === 'Enterprise' ? (
								<div style={{ marginBottom: '80px', textAlign: 'center' }}>
									<DisplayText size='large'>{pkg_name}</DisplayText>
									<DisplayText size='large'></DisplayText>
								</div>
							) : (
								<div style={{ textAlign: 'center' }}>
									<div style={{ marginBottom: '30px' }}>
										<DisplayText size='large'>
											{pkg_name} {packageId === 1 ? '(1 Week)' : ''}
										</DisplayText>
									</div>
									<DisplayText size='large'>
										${price} {duration === 30 ? '/mo' : ''}
									</DisplayText>
								</div>
							)
						}
					></Card.Header>
					<div
						style={{
							display: 'flex',
							marginTop: '20px',
							textAlign: 'center',
							flexDirection: 'column',
							justifyContent: 'center',
						}}
					>
						<Card.Section>
							<Heading>
								<TextStyle variation='positive'>{spamChecker}</TextStyle> Spam
								Checks/day
							</Heading>
						</Card.Section>
						<Card.Section>
							<Heading>
								<TextStyle variation='positive'>{dnsChecker} </TextStyle> DNS
								Checks/day
							</Heading>
						</Card.Section>
						<Card.Section>
							<Heading>
								<TextStyle variation='positive'>{emailGrader} </TextStyle>
								Gradings/day
							</Heading>
						</Card.Section>
						<Card.Section>
							<Heading>
								<TextStyle variation='positive'>{sequences} </TextStyle>
								Sequences/day
							</Heading>
						</Card.Section>
					</div>
					<div style={{ marginTop: '30px' }}>
						<Stack distribution='center'>
							{pkg_name === 'Enterprise' ? (
								<Link
									to={{ pathname: '/support' }}
									style={{
										textDecoration: 'none',
										pointerEvents: subscribing ? 'none' : 'initial',
									}}
								>
									<Button primary>Contact Us</Button>
								</Link>
							) : JSON.parse(localStorage.getItem('user')).isNewUser === 1 ? (
								packageId === 1 ? (
									<Button
										primary
										loading={subscribing}
										disabled={subscribing}
										onClick={() =>
											handlePurchase(price, packageId, {
												price: price,
												price_id: priceId,
												pkg_name: pkg_name,
												duration: duration,
												sequences: sequences,
												dnsChecker: dnsChecker,
												spamChecker: spamChecker,
												emailGrader: emailGrader,
												email_per_day: email_per_day,
											})
										}
									>
										{subscribing ? <></> : <></>}
										Purchase Now
									</Button>
								) : (
									<Button
										primary
										loading={subscribing}
										disabled={subscribing}
										onClick={() =>
											handlePurchase(price, packageId, {
												price: price,
												price_id: priceId,
												pkg_name: pkg_name,
												duration: duration,
												sequences: sequences,
												dnsChecker: dnsChecker,
												spamChecker: spamChecker,
												emailGrader: emailGrader,
												email_per_day: email_per_day,
											})
										}
									>
										{packageId === 2 ? 'Purchase Now' : 'Subscribe'}
									</Button>
								)
							) : packageId === 1 ? (
								<>
									<br />
									<br />
								</>
							) : packageId !== 1 ? (
								JSON.parse(localStorage.getItem('user')).package.id === 2 &&
								packageId === 2 ? (
									<>
										<br />
										<br />
										<br />
									</>
								) : JSON.parse(localStorage.getItem('user')).package.id ===
										packageId &&
								  JSON.parse(localStorage.getItem('user')).stripePayment
										.subscription_id !== null ? (
									JSON.parse(localStorage.getItem('user')).stripePayment
										.is_subscribed ? (
										<Button
											destructive
											loading={subscribing}
											disabled={subscribing}
											className='unsub-button my-3'
											onClick={() => handlePauseSubscription(packageId)}
										>
											Pause Subscription
										</Button>
									) : (
										<Button
											loading={subscribing}
											disabled={subscribing}
											className='resumesub-button my-3'
											onClick={() => handleResumeSubscription(packageId)}
										>
											Resume Subscription
										</Button>
									)
								) : (
									<Button
										primary
										id='payment-form'
										loading={subscribing}
										disabled={subscribing}
										className='buy_button my-3'
										onClick={() => {
											if (
												packageId === 2 ||
												JSON.parse(localStorage.getItem('user')).package.id ===
													2
											)
												handlePurchase(price, packageId, {
													price: price,
													price_id: priceId,
													pkg_name: pkg_name,
													duration: duration,
													sequences: sequences,
													dnsChecker: dnsChecker,
													spamChecker: spamChecker,
													emailGrader: emailGrader,
													email_per_day: email_per_day,
												})
											else if (
												JSON.parse(localStorage.getItem('user')).package.id !==
												packageId
											)
												handleUpgradePlan(price, packageId, {
													price: price,
													price_id: priceId,
													pkg_name: pkg_name,
													duration: duration,
													sequences: sequences,
													dnsChecker: dnsChecker,
													spamChecker: spamChecker,
													emailGrader: emailGrader,
													email_per_day: email_per_day,
												})
										}}
									>
										{packageId === 2 ? 'Purchase Now' : 'Upgrade'}
									</Button>
								)
							) : JSON.parse(localStorage.getItem('user')).package.id === 2 &&
							  packageId === 2 ? (
								<>
									<br />
									<br />
									<br />
								</>
							) : (
								<></>
							)}
						</Stack>
					</div>
				</div>
			</Card>
		</div>
	)
}

export default Package
