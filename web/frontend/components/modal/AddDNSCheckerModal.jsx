import {
	Modal,
	Button,
	TextField,
	TextStyle,
	TextContainer,
} from '@shopify/polaris'
import { useState } from 'react'
import { Editor } from 'react-draft-wysiwyg'

const AddDNSCheckerModal = ({
	active,
	loading,
	password,
	emailBody,
	senderEmail,
	setPassword,
	setEmailBody,
	setSenderEmail,
	recipientEmail,
	editorStateExp,
	subjectHeadline,
	handleAddNewTest,
	handleModalChange,
	setSubjectHeadline,
	onEditorStateChangeExp,
}) => {
	const [showPassword, setShowPassword] = useState(false)

	return (
		<div style={{ height: '500px' }}>
			<Modal
				open={active}
				onClose={handleModalChange}
				primaryAction={{
					content: 'Next',
					loading: loading,
					onAction: handleAddNewTest,
				}}
				secondaryActions={[
					{
						content: 'Close',
						onAction: handleModalChange,
					},
				]}
				title='Email Blacklists & DNS Checker'
			>
				<Modal.Section>
					<TextContainer>
						<p>
							Send an email to the address below, from the email you want to
							test
						</p>
						<TextStyle variation='negative'>
							<b>Send an email at the address below, then click on Next.</b>
						</TextStyle>
						<div style={{ display: 'flex', flexDirection: 'column' }}>
							<div style={{ marginBottom: '10px' }}>
								<TextField
									disabled
									readOnly
									value={recipientEmail}
									label='Recipient Email'
								/>
							</div>
							<div style={{ marginBottom: '10px' }}>
								<TextField
									label='Sender Email'
									value={senderEmail}
									onChange={newValue => setSenderEmail(newValue)}
								/>
							</div>
							<div
								style={{
									display: 'flex',
									flexDirection: 'row',
									marginBottom: '10px',
								}}
							>
								<div style={{ marginRight: '5px', flexGrow: '1' }}>
									<TextField
										label='Password'
										value={password}
										type={showPassword ? 'text' : 'password'}
										onChange={newValue => setPassword(newValue)}
									/>
								</div>
								<div style={{ height: '50%', marginTop: '4.1%' }}>
									<Button
										primary
										onClick={() => setShowPassword(!showPassword)}
									>
										{showPassword ? 'Hide' : 'Show'}
									</Button>
								</div>
							</div>
							<div style={{ marginBottom: '10px' }}>
								<TextField
									label='Subject Headline'
									value={subjectHeadline}
									onChange={newValue => setSubjectHeadline(newValue)}
								/>
							</div>

							<TextField
								multiline={7}
								value={emailBody}
								label='Email Body'
								onChange={newValue => setEmailBody(newValue)}
							/>

							{/* <label htmlFor='youremail'>Email Body</label>
							<Editor
								toolbarOnFocus
								toolbar={{
									options: [
										'inline',
										'blockType',
										'fontSize',
										'fontFamily',
										'list',
										'textAlign',
										'emoji',
										'image',
										'remove',
										'history',
									],
									inline: { inDropDown: true },
									blockType: { inDropDown: true },
									fontSize: { inDropDown: true },
									fontFamily: { inDropDown: true },
									list: { inDropDown: true },
									textAlign: { inDropDown: true },
									emoji: { inDropDown: true },
									image: { inDropDown: true },
									remove: { inDropDown: true },
									history: { inDropDown: true },
								}}
								name='email_body'
								spellCheck={true}
								editorState={editorStateExp}
								placeholder='Explanation...'
								wrapperClassName='wrapperStyle'
								editorClassName='editorStyleExp'
								onEditorStateChange={onEditorStateChangeExp}
								toolbarStyle={{ display: 'flex', flexDirection: 'row' }}
							/> */}
						</div>
					</TextContainer>
				</Modal.Section>
			</Modal>
		</div>
	)
}

export default AddDNSCheckerModal
