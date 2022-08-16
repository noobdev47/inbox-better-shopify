import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Provider } from '@shopify/app-bridge-react'
import { Banner, Layout, Page } from '@shopify/polaris'

/**
 * A component to configure App Bridge.
 * @desc A thin wrapper around AppBridgeProvider that provides the following capabilities:
 *
 * 1. Ensures that navigating inside the app updates the host URL.
 * 2. Configures the App Bridge Provider, which unlocks functionality provided by the host.
 *
 * See: https://shopify.dev/apps/tools/app-bridge/react-components
 */
export function AppBridgeProvider({ children }) {
	const location = useLocation()
	const navigate = useNavigate()
	const history = useMemo(
		() => ({
			replace: path => {
				navigate(path, { replace: true })
			},
		}),
		[navigate]
	)

	const routerConfig = useMemo(
		() => ({ history, location }),
		[history, location]
	)

	// The host may be present initially, but later removed by navigation.
	// By caching this in state, we ensure that the host is never lost.
	// During the lifecycle of an app, these values should never be updated anyway.
	// Using state in this way is preferable to useMemo.
	// See: https://stackoverflow.com/questions/60482318/version-of-usememo-for-caching-a-value-that-will-never-change
	const [appBridgeConfig] = useState(() => {
		console.log(import.meta.env.VITE_SHOPIFY_APP_URL)
		return {
			host: process.env.REACT_APP_SHOPIFY_APP_URL,
			apiKey: process.env.SHOPIFY_API_KEY,
			forceRedirect: true,
		}
	})

	if (!process.env.SHOPIFY_API_KEY) {
		return (
			<Page narrowWidth>
				<Layout>
					<Layout.Section>
						<div style={{ marginTop: '100px' }}>
							<Banner title='Missing Shopify API key' status='critical'>
								Your app is running without the SHOPIFY_API_KEY environment
								variable. Please ensure that it is set when running or building
								your React app.
							</Banner>
						</div>
					</Layout.Section>
				</Layout>
			</Page>
		)
	}

	return (
		<Provider config={appBridgeConfig} router={routerConfig}>
			{children}
		</Provider>
	)
}
