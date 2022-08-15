import { Button, Form } from '@shopify/polaris'
import { useEffect, useState } from 'react'
import PlanService from '../../../api_services/plan.service'
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'

const CheckoutForm = ({
	priceId,
	packageId,
	fetchPlans,
	customerId,
	handleToggle,
	subscriptionId,
	setClientSecret,
	setloadingPaymentElements,
}) => {
	const stripe = useStripe()
	const elements = useElements()

	const [message, setMessage] = useState(null)
	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		if (!stripe) {
			return
		}

		const clientSecret = new URLSearchParams(window.location.search).get(
			'payment_intent_client_secret'
		)

		if (!clientSecret) {
			return
		}

		stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
			switch (paymentIntent.status) {
				case 'succeeded':
					setMessage('Payment succeeded!')
					break
				case 'processing':
					setMessage('Your payment is processing.')
					break
				case 'requires_payment_method':
					setMessage('Your payment was not successful, please try again.')
					break
				default:
					setMessage('Something went wrong.')
					break
			}
		})
	}, [stripe])

	const handleSubmit = async e => {
		e.preventDefault()

		if (!stripe || !elements) {
			// Stripe.js has not yet loaded.
			// Make sure to disable form submission until Stripe.js has loaded.
			return
		}

		setIsLoading(true)

		stripe
			.confirmPayment({
				elements,
				confirmParams: {
					// Make sure to change this to your payment completion page
				},
				redirect: 'if_required',
			})
			.then(async result => {
				const response = await PlanService.sendPaymentDetails({
					package_id: packageId,
					customer_id: customerId,
					price: result.paymentIntent.amount,
					paymentIntent: result.paymentIntent.id,
					currency: result.paymentIntent.currency,
					price_id: packageId === 2 ? '' : priceId,
					subscription_id: packageId === 2 ? '' : subscriptionId,
				})

				if (response.success) {
					var paymentElement = elements.getElement('payment')

					paymentElement.clear()
					setClientSecret('')
					localStorage.setItem('user', JSON.stringify(response.user))

					fetchPlans()

					handleToggle()
				}

				setIsLoading(false)
			})
			.catch(err => {
				if (err.type === 'card_error' || err.type === 'validation_error') {
					setIsLoading(false)
					setMessage(err.message)
				} else {
					setIsLoading(false)
					setMessage('An unexpected error occured.')
				}
			})

		// This point will only be reached if there is an immediate error when
		// confirming the payment. Otherwise, your customer will be redirected to
		// your `return_url`. For some payment methods like iDEAL, your customer will
		// be redirected to an intermediate site first to authorize the payment, then
		// redirected to the `return_url`.
	}

	return (
		<Form id='payment-form' onSubmit={handleSubmit}>
			<PaymentElement id='payment-element' />
			<div
				style={{
					display: 'flex',
					marginTop: '30px',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<Button
					primary
					id='submit'
					type='submit'
					loading={isLoading}
					disabled={isLoading || !stripe || !elements}
				>
					Pay Now
				</Button>
			</div>
		</Form>
	)
}

export default CheckoutForm
