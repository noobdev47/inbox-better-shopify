import {
	AuthProvider,
	GraphQLProvider,
	PolarisProvider,
	AppBridgeProvider,
} from './components'
import Routes from './Routes'
import { BrowserRouter } from 'react-router-dom'
import { NavigationMenu } from '@shopify/app-bridge-react'

export default function App() {
	// Any .tsx or .jsx files in /pages will become a route
	// See documentation for <Routes /> for more info
	const pages = import.meta.globEager('./pages/**/!(*.test.[jt]sx)*.([jt]sx)')

	return (
		<PolarisProvider>
			<BrowserRouter>
				<AppBridgeProvider>
					<GraphQLProvider>
						<NavigationMenu
							navigationLinks={[
								{
									label: 'DNS Checker',
									destination: '/dns_checker/DNSChecker',
								},
								{
									label: 'Spam Checker',
									destination: '/spam_checker/SpamChecker',
								},
								{
									label: 'Subscriptions',
									destination: '/subscriptions',
								},
							]}
						/>
						<AuthProvider>
							<Routes pages={pages} />
						</AuthProvider>
					</GraphQLProvider>
				</AppBridgeProvider>
			</BrowserRouter>
		</PolarisProvider>
	)
}
