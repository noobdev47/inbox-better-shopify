import { Elements } from '@stripe/react-stripe-js'
import CheckoutForm from '../form/checkout/CheckoutForm'
import {
	Card,
	DisplayText,
	Frame,
	Heading,
	Loading,
	Modal,
	Stack,
	TextStyle,
} from '@shopify/polaris'

const CheckoutModal = ({
	priceId,
	options,
	modalOpen,
	fetchPlans,
	customerId,
	handleToggle,
	selectedPlan,
	clientSecret,
	stripePromise,
	subscriptionId,
	setClientSecret,
	packageId,
	setloadingPaymentElements,
}) => {
	return (
		<div style={{ height: '800px' }}>
			<Modal large open={modalOpen} onClose={handleToggle} titleHidden>
				<Modal.Section>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						{clientSecret !== '' ? (
							<div
								style={{
									display: 'flex',
									flexDirection: 'row',
									alignItems: 'center',
									justifyContent: 'center',
								}}
							>
								<Card>
									<div
										style={{
											flexGrow: '1',
											margin: '10px',
											width: '450px',
											flex: '0 1 47%',
											display: 'flex',
											flexDirection: 'column',
										}}
									>
										<Card.Header
											title={
												<div style={{ textAlign: 'center' }}>
													<div style={{ marginBottom: '30px' }}>
														<DisplayText size='large'>
															{selectedPlan.pkg_name}
														</DisplayText>
													</div>
													<DisplayText size='large'>
														${selectedPlan.price}{' '}
														{selectedPlan.duration === 30 ? '/mo' : ''}
													</DisplayText>
												</div>
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
													<TextStyle variation='positive'>
														{selectedPlan.spamChecker}
													</TextStyle>{' '}
													Spam Checks/day
												</Heading>
											</Card.Section>
											<Card.Section>
												<Heading>
													<TextStyle variation='positive'>
														{selectedPlan.dnsChecker}{' '}
													</TextStyle>{' '}
													DNS Checks/day
												</Heading>
											</Card.Section>
											<Card.Section>
												<Heading>
													<TextStyle variation='positive'>
														{selectedPlan.emailGrader}{' '}
													</TextStyle>
													Gradings/day
												</Heading>
											</Card.Section>
											<Card.Section>
												<Heading>
													<TextStyle variation='positive'>
														{selectedPlan.sequences}{' '}
													</TextStyle>
													Sequences/day
												</Heading>
											</Card.Section>
										</div>
									</div>
								</Card>
								<div
									style={{
										flexGrow: '1',
										margin: '10px',
										width: '450px',
										flex: '0 1 47%',
									}}
								>
									<Elements options={options} stripe={stripePromise}>
										<CheckoutForm
											priceId={priceId}
											packageId={packageId}
											customerId={customerId}
											fetchPlans={fetchPlans}
											subscriptionId={subscriptionId}
											setClientSecret={setClientSecret}
											setloadingPaymentElements={setloadingPaymentElements}
										/>
									</Elements>
								</div>
							</div>
						) : (
							<div style={{ height: '150px' }}>
								<Frame>
									<Loading />
								</Frame>
							</div>
						)}
					</div>
				</Modal.Section>
			</Modal>
		</div>
	)
}

export default CheckoutModal
