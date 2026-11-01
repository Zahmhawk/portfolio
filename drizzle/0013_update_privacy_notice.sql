UPDATE settings SET data=json_set(data,'$.privacy','We use your account, contact and registration information to manage sign-in, respond to enquiries, provide resource access and coordinate programmes. Resource access details and test or survey submissions are stored for authorised administrative review.

Research participation is voluntary. Please review each questionnaire’s purpose and consent information before submitting. Individual answers, assessments and reports are accessible only to authorised administrators; they are not displayed publicly or shown to participants through the website. The administrator may contact you separately to discuss your results.

If you use the AI assistant, your messages and attachments may be processed by the selected AI provider. Google or Apple sign-in, when enabled, uses the respective provider to verify your identity.

Contact the site owner to request access to, correction of or deletion of your identifiable records, or to withdraw your newsletter subscription.') WHERE id='site';
