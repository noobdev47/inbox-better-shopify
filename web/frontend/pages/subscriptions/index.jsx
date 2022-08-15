import Package from './Package'
import { loadStripe } from '@stripe/stripe-js'
import { useCallback, useEffect, useState } from 'react'
import PlanService from '../../api_services/plan.service'
import { Frame, Loading, Page, Stack } from '@shopify/polaris'
import CheckoutModal from '../../components/modal/CheckoutModal'

const Subscription = () => {
	const [plans, setPlans] = useState([])
	const [priceId, setPriceId] = useState('')
	const [customerId, setCustomerId] = useState('')
	const [modalOpen, setModalOpen] = useState(false)
	const [selectedPlan, setSelectedPlan] = useState({})
	const [clientSecret, setClientSecret] = useState('')
	const [subscribing, setSubscribing] = useState(false)
	const [loadingPlans, setLoadingPlans] = useState(false)
	const [subscriptionId, setSubscriptionId] = useState('')
	const [selectedPackageId, setSelectedPackageId] = useState(0)
	const [loadingPaymentElements, setloadingPaymentElements] = useState(true)
	const [stripePromise, setStripePromise] = useState(() =>
		loadStripe(
			import.meta.env.VITE_TEST_MODE === 'true'
				? 'pk_test_51K9wCBCS6ywz511Ria36w4YXMry4tekv8nMYKPijWo3i5VrKn7CeYZRzQOrhkSdEQsWIeRNo8iEsI90K0enL0oi200GweX3Jy6'
				: 'pk_test_HGwbj9cQIFbvCl0BpeS0oJNu'
		)
	)

	const handleToggle = useCallback(() => setModalOpen(!modalOpen), [modalOpen])

	const fetchPlans = async () => {
		setLoadingPlans(true)
		const response = await PlanService.list()

		if (response.success) {
			setPlans(response.packageDetails)
			setLoadingPlans(false)
		} else {
			setLoadingPlans(false)
		}
	}

	const options = {
		clientSecret: clientSecret,
		appearance: {
			theme: 'stripe',
			labels: 'floating',
		},
	}

	const handleUpgradePlan = async (price, packageId, planObj) => {
		setSubscribing(true)
		if (packageId === 2) {
			try {
				const response = await PlanService.getSinglePaymentClientSecret(
					price,
					customerId === ''
						? JSON.parse(localStorage.getItem('user')).stripePayment === null
							? null
							: JSON.parse(localStorage.getItem('user')).stripePayment
									.customer_id
						: customerId
				)

				if (response.success) {
					setSelectedPlan(planObj)
					setSelectedPackageId(packageId)
					// setPriceId(response.Data.priceId)
					setCustomerId(response.Data.CustomerId)
					setClientSecret(response.Data.clientSecret)
					// setSubscriptionId(response.Data.SubscriptionId)
					options.clientSecret = response.Data.clientSecret

					let localUser = JSON.parse(localStorage.getItem('user'))

					// localUser.stripePayment.customer_id = response.Data.CustomerId
					localUser.stripePayment.subscription_id = ''
					localUser.stripePayment.price_id = ''

					localUser.package.price_id = ''

					localStorage.setItem('user', JSON.stringify(localUser))

					// var myModal = Modal.getOrCreateInstance(modalInstance)

					// myModal.show()

					setSubscribing(false)
				} else {
					closeModal()
					setSubscribing(false)
				}
			} catch (error) {
				console.log(error)
				setSubscribing(false)
			}
		} else {
			try {
				const response = await PlanService.upgradePlan(
					planObj.price_id,
					JSON.parse(localStorage.getItem('user')).stripePayment
						.subscription_id,
					packageId
				)

				if (response.success) {
					setSelectedPlan(planObj)
					setSelectedPackageId(packageId)
					setPriceId(response.user.package.priceId)
					// setCustomerId(response.Data.CustomerId)
					setSubscriptionId(response.user.stripePayment.SubscriptionId)

					localStorage.setItem('user', JSON.stringify(response.user))

					setSubscribing(false)

					fetchPlans()
				} else {
					setSubscribing(false)
				}
			} catch (e) {
				setSubscribing(false)
			}
		}
	}

	const handlePurchase = async (price, packageId, planObj) => {
		setClientSecret('')
		setSubscribing(true)

		if (packageId === 2 || packageId === 1) {
			try {
				const response = await PlanService.getSinglePaymentClientSecret(
					price,
					customerId === ''
						? JSON.parse(localStorage.getItem('user')).stripePayment === null
							? ''
							: JSON.parse(localStorage.getItem('user')).stripePayment
									.customer_id
						: customerId
				)

				if (response.success) {
					setSelectedPlan(planObj)
					setSelectedPackageId(packageId)
					// setPriceId(response.Data.priceId)
					setCustomerId(response.Data.CustomerId)
					setClientSecret(response.Data.clientSecret)
					// setSubscriptionId(response.Data.SubscriptionId)
					options.clientSecret = response.Data.clientSecret

					setSubscribing(false)

					handleToggle()

					let localUser = JSON.parse(localStorage.getItem('user'))

					localUser.stripePayment = {
						customer_id: response.Data.CustomerId,
					}
					// localUser.stripePayment.subscription_id = ''
					// localUser.stripePayment.price_id = ''

					// localUser.package.price_id = ''

					localStorage.setItem('user', JSON.stringify(localUser))
				} else {
					setSubscribing(false)
					closeModal()
				}
			} catch (error) {
				setSubscribing(false)

				console.log(error)
			}
		} else {
			try {
				const response = await PlanService.getSubClientSecret(
					price,
					packageId,
					customerId === '' || customerId === undefined || customerId === null
						? JSON.parse(localStorage.getItem('user')).stripePayment === null ||
						  JSON.parse(localStorage.getItem('user')).stripePayment ===
								undefined
							? ''
							: JSON.parse(localStorage.getItem('user')).stripePayment
									.customer_id === undefined ||
							  JSON.parse(localStorage.getItem('user')).stripePayment
									.customer_id === null
							? ''
							: JSON.parse(localStorage.getItem('user')).stripePayment
									.customer_id
						: customerId,
					planObj.price_id === null ? '' : planObj.price_id
				)

				if (response.success) {
					setSelectedPlan(planObj)
					setSelectedPackageId(packageId)
					setPriceId(response.Data.priceId)
					setCustomerId(response.Data.CustomerId)
					setClientSecret(response.Data.clientSecret)
					setSubscriptionId(response.Data.SubscriptionId)
					options.clientSecret = response.Data.clientSecret

					let localUser = JSON.parse(localStorage.getItem('user'))

					// if (localUser.stripePayment === null) {
					localUser.stripePayment = {
						// price_id: response.Data.priceId,
						customer_id: response.Data.CustomerId,
						// subscription_id: response.Data.SubscriptionId,
					}

					// 	localUser.package = {
					// 		price_id: response.Data.priceId,
					// 	}
					// } else {
					// 	localUser.stripePayment.subscription_id =
					// 		response.Data.SubscriptionId
					// 	localUser.stripePayment.price_id = response.Data.priceId
					// 	localUser.stripePayment.customer_id = response.Data.CustomerId

					// 	localUser.package = {
					// 		price_id: response.Data.priceId,
					// 	}
					// }

					localStorage.setItem('user', JSON.stringify(localUser))

					setSubscribing(false)

					handleToggle()
				} else {
					setSubscribing(false)

					handleToggle()
				}
			} catch (error) {
				setSubscribing(false)
			}
		}
	}

	const handlePauseSubscription = async packageId => {
		setSubscribing(true)

		try {
			const response = await PlanService.pauseSubscription(packageId)

			if (response.success) {
				setSubscribing(false)
				localStorage.setItem('user', JSON.stringify(response.user))
				fetchPlans()
			} else {
				setSubscribing(false)
			}
		} catch (error) {
			setSubscribing(false)
		}
	}

	const handleResumeSubscription = async packageId => {
		setSubscribing(true)

		try {
			const response = await PlanService.resumeSubscription(packageId)

			if (response.success) {
				setSubscribing(false)
				localStorage.setItem('user', JSON.stringify(response.user))
				fetchPlans()
			} else {
				setSubscribing(false)
			}
		} catch (error) {
			setSubscribing(false)
		}
	}

	const handleUnsubscription = async packageId => {
		try {
			const response = await PlanService.unsubscribe(packageId)
		} catch (error) {
			console.log(error)
		}
	}

	useEffect(() => {
		fetchPlans()
	}, [])

	return (
		<Page
			fullWidth
			title='Subscription Plans'
			subtitle='We have extremely transparent plans'
		>
			{loadingPlans ? (
				<div style={{ height: '150px' }}>
					<Frame>
						<Loading />
					</Frame>
				</div>
			) : plans.length === 0 ? (
				<h4 className='text-center'>No Plans Found...</h4>
			) : (
				<Stack>
					{plans
						.filter(plan => !plan.is_disabled)
						.filter(plan => plan.id !== 8)
						.map((plan, i) => (
							<Package
								key={i}
								style={{
									padding: '15px',
									background: '#E2F1F4',
								}}
								options={options}
								price={plan.price}
								packageId={plan.id}
								pkg_name={plan.name}
								priceId={plan.price_id}
								subscribing={subscribing}
								clientSecret={clientSecret}
								stripePromise={stripePromise}
								subscriptionId={subscriptionId}
								handlePurchase={handlePurchase}
								duration={plan.duration_in_days}
								img_src={'/assets/img/solo_pkg.png'}
								selectedPackageId={selectedPackageId}
								handleUpgradePlan={handleUpgradePlan}
								handleUnsubscription={handleUnsubscription}
								loadingPaymentElements={loadingPaymentElements}
								handlePauseSubscription={handlePauseSubscription}
								handleResumeSubscription={handleResumeSubscription}
								setloadingPaymentElements={setloadingPaymentElements}
								email_per_day={
									plan.packagefeatures !== undefined
										? plan.packagefeatures.find(
												feature => feature.system_feature_id === 1
										  ) !== undefined
											? plan.packagefeatures.find(
													feature => feature.system_feature_id === 1
											  ).max_allowed_count
											: ''
										: ''
								}
								spamChecker={
									plan.packagefeatures !== undefined
										? plan.packagefeatures.find(
												feature => feature.system_feature_id === 3
										  ) !== undefined
											? plan.packagefeatures.find(
													feature => feature.system_feature_id === 3
											  ).max_allowed_count
											: ''
										: ''
								}
								dnsChecker={
									plan.packagefeatures !== undefined
										? plan.packagefeatures.find(
												feature => feature.system_feature_id === 2
										  ) !== undefined
											? plan.packagefeatures.find(
													feature => feature.system_feature_id === 2
											  ).max_allowed_count
											: ''
										: ''
								}
								emailGrader={
									plan.packagefeatures !== undefined
										? plan.packagefeatures.find(
												feature => feature.system_feature_id === 4
										  ) !== undefined
											? plan.packagefeatures.find(
													feature => feature.system_feature_id === 4
											  ).max_allowed_count
											: ''
										: ''
								}
								sequences={
									plan.packagefeatures !== undefined
										? plan.packagefeatures.find(
												feature => feature.system_feature_id === 5
										  ) !== undefined
											? plan.packagefeatures.find(
													feature => feature.system_feature_id === 5
											  ).max_allowed_count
											: ''
										: ''
								}
							/>
						))}
				</Stack>
			)}
			<CheckoutModal
				options={options}
				priceId={priceId}
				modalOpen={modalOpen}
				customerId={customerId}
				fetchPlans={fetchPlans}
				handleToggle={handleToggle}
				clientSecret={clientSecret}
				selectedPlan={selectedPlan}
				stripePromise={stripePromise}
				packageId={selectedPackageId}
				subscriptionId={subscriptionId}
				setClientSecret={setClientSecret}
				setloadingPaymentElements={setloadingPaymentElements}
			/>
		</Page>
	)
}

export default Subscription
