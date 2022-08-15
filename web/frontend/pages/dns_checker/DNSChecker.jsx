import { v4 as uuidv4 } from 'uuid'
import { convertToRaw, EditorState } from 'draft-js'
import Table from '../../components/table/Table'
import Filter from '../../components/filter/Filter'
import { useState, useCallback, useEffect } from 'react'
import DNSCheckerService from '../../api_services/dnsCheckerService'
import { Page, Card, Button, Layout, Pagination } from '@shopify/polaris'
import AddDNSCheckerModal from '../../components/modal/AddDNSCheckerModal'

const DNSChecker = () => {
	const [email, setEmail] = useState('')
	const [open, setOpen] = useState(false)
	const [active, setActive] = useState(false)
	const [password, setPassword] = useState('')
	const [loading, setLoading] = useState(false)
	const [emailBody, setEmailBody] = useState('')
	const [activePage, setActivePage] = useState(1)
	const [senderEmail, setSenderEmail] = useState('')
	const [dnsCheckers, setDnsCheckers] = useState([])
	const [recipientEmail, setRecipientEmail] = useState(
		uuidv4() + '@inboxbetter.com'
	)
	const [editorStateExp, setEditorStateExp] = useState(
		EditorState.createEmpty()
	)
	const [metaData, setMetaData] = useState({
		total: 0,
		per_page: 0,
		last_page: 2,
	})
	const [subjectHeadline, setSubjectHeadline] = useState('')

	const handleToggle = useCallback(() => setOpen(open => !open), [])
	const handleModalChange = useCallback(() => setActive(!active), [active])

	const handleFilter = async () => {
		setLoading(true)
		try {
			const response = await DNSCheckerService.getDomainHealths(email)

			if (response.data.length !== 0) {
				setDnsCheckers(response.data)
				setMetaData({
					...metaData,
					total: response.total,
					per_page: response.per_page,
					last_page: response.last_page,
				})
				setActivePage(1)
			}
			setLoading(false)
		} catch (error) {
			setLoading(false)
		}
	}

	const handleClear = () => {
		setEmail('')
		fetchData()
	}

	const handleNextPage = async () => {
		setLoading(true)
		try {
			const response = await DNSCheckerService.getDomainHealths(
				email,
				activePage + 1
			)

			if (response.data.length !== 0) {
				setDnsCheckers(response.data)
				setMetaData({
					...metaData,
					total: response.total,
					per_page: response.per_page,
					last_page: response.last_page,
				})
				setActivePage(activePage + 1)
			}
			setLoading(false)
		} catch (error) {
			setLoading(false)
		}
	}

	const handlePreviousPage = async () => {
		setLoading(true)

		try {
			const response = await DNSCheckerService.getDomainHealths(
				email,
				activePage - 1
			)

			if (response.data.length !== 0) {
				setDnsCheckers(response.data)
				setMetaData({
					...metaData,
					total: response.total,
					per_page: response.per_page,
					last_page: response.last_page,
				})
				setActivePage(activePage - 1)
			}
			setLoading(false)
		} catch (error) {
			setLoading(false)
		}
	}

	const handleAddNewTest = async () => {
		setLoading(true)

		try {
			const response = await DNSCheckerService.postRunNewTest({
				password: password,
				email_body: emailBody,
				from_email: senderEmail,
				to_email: recipientEmail,
				subject_line: subjectHeadline,
			})

			if (response.sucess) {
				handleModalChange()
				fetchData()
			}
			setLoading(false)
		} catch (error) {
			setLoading(false)
		}
	}

	const fetchData = async () => {
		setLoading(true)

		try {
			const response = await DNSCheckerService.getDomainHealths(email)

			if (response.data.length !== 0) {
				setDnsCheckers(response.data)
				setMetaData({
					...metaData,
					total: response.total,
					per_page: response.per_page,
					last_page: response.last_page,
				})
			}
			setLoading(false)
		} catch (error) {
			setLoading(false)
		}
	}

	const onEditorStateChangeExp = editorStateExp => {
		setEditorStateExp(editorStateExp)
	}

	useEffect(() => {
		const block = convertToRaw(editorStateExp.getCurrentContent()).blocks

		if (block[0].text !== '')
			setEmailBody(
				block
					.map(block => (!block.text.trim() && '\n') || block.text)
					.join('\n')
			)
	}, [editorStateExp])

	useEffect(() => {
		fetchData()
	}, [])

	return (
		<Page
			fullWidth
			compactTitle
			primaryAction={{
				content: 'Filter',
				onAction: handleToggle,
			}}
			title='Email Blacklist & DNS Checker'
			subtitle='Check if your IPs & domains are blacklisted.
      Test your DNS settings to improve your deliverability.'
			breadcrumbs={[{ content: 'HomePage', url: '/' }]}
			secondaryActions={
				<Button onClick={handleModalChange}>Run a New Test</Button>
			}
		>
			<Layout>
				<Layout.Section>
					<Card sectioned>
						<Filter
							open={open}
							email={email}
							setEmail={setEmail}
							handleClear={handleClear}
							handleFilter={handleFilter}
						/>
						<Table loading={loading} dnsCheckers={dnsCheckers} />
						<div
							style={{
								display: 'flex',
								marginTop: '10px',
								justifyContent: 'center',
							}}
						>
							<Pagination
								label={activePage}
								onNext={handleNextPage}
								hasPrevious={activePage > 1}
								onPrevious={handlePreviousPage}
								hasNext={activePage < metaData.last_page}
							/>
						</div>
					</Card>
				</Layout.Section>
			</Layout>
			<AddDNSCheckerModal
				active={active}
				loading={loading}
				password={password}
				emailBody={emailBody}
				senderEmail={senderEmail}
				setPassword={setPassword}
				setEmailBody={setEmailBody}
				recipientEmail={recipientEmail}
				setSenderEmail={setSenderEmail}
				editorStateExp={editorStateExp}
				subjectHeadline={subjectHeadline}
				handleAddNewTest={handleAddNewTest}
				handleModalChange={handleModalChange}
				setSubjectHeadline={setSubjectHeadline}
				onEditorStateChangeExp={onEditorStateChangeExp}
			/>
		</Page>
	)
}

export default DNSChecker
