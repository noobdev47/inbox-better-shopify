import { useNavigate } from 'react-router-dom'
import { Page, Card, Layout, TextStyle, Button } from '@shopify/polaris'

const HomePage = () => {
	const navigate = useNavigate()

	return (
		<Page compactTitle>
			<Layout>
				<Layout.Section>
					<Card sectioned>
						<h4>
							<TextStyle variation='strong'>DNS Checker</TextStyle>
						</h4>
						<Button primary onClick={() => navigate('/dns_checker/DNSChecker')}>
							Go to DNS Checker
						</Button>
					</Card>
				</Layout.Section>
				<Layout.Section>
					<Card sectioned>
						<h4>
							<TextStyle variation='strong'>Spam Checker</TextStyle>
						</h4>
						<Button
							primary
							onClick={() => navigate('/spam_checker/SpamChecker')}
						>
							Go to Spam Checker
						</Button>
					</Card>
				</Layout.Section>
			</Layout>
		</Page>
	)
}

export default HomePage
