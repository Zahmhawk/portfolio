const sections=[
  [
    "Using this website",
    "This website provides educational information, resources, mentoring, programme enquiries and voluntary research questionnaires. By using its features, you agree to use them responsibly and provide accurate information."
  ],
  [
    "Accounts and access",
    "Keep your sign-in details private. Use only your own account and do not attempt to access another person's records, administrator functions or restricted resources. Contact the site owner if you suspect unauthorised account use."
  ],
  [
    "Programmes and registrations",
    "Submitting an enquiry or registration records your interest. Participation, dates, availability, fees and any cancellation or refund arrangements must be confirmed separately with the administrator before you make a commitment."
  ],
  [
    "Resources and permitted use",
    "Use resources for your own learning and authorised educational purposes, subject to any licence or permissions stated on the resource. Do not resell, redistribute or claim ownership of materials without permission from the rights holder."
  ],
  [
    "Questionnaires, assessments and results",
    "Research participation is voluntary and each questionnaire's purpose and consent information applies to your submission. Educational assessments and reports support reflection and administrator review; they do not provide a medical diagnosis or guarantee an outcome. Individual answers, assessments and reports are available only to authorised administrators through this website. Participants cannot view them here; the administrator may discuss results separately."
  ],
  [
    "AI assistant and external services",
    "AI responses may be inaccurate or incomplete. Verify information before relying on it and do not submit material you have no right to share. Messages and attachments may be processed by the selected AI provider. External links and Google or Apple sign-in, when enabled, are also subject to the respective providers' terms and privacy policies."
  ],
  [
    "Submissions and acceptable conduct",
    "Submit only content you are authorised to share. Do not upload unlawful, harmful or malicious material, send spam, impersonate others or disrupt the service. Public feedback is subject to moderation and publication consent. Access may be restricted where necessary to address misuse or protect the service."
  ],
  [
    "Privacy, availability and contact",
    "The Privacy and participation notice explains how identifiable information and submissions are handled. Features and content may change, and uninterrupted availability or specific learning outcomes are not guaranteed. Any updated terms will be made available here. Contact the site owner through the Contact page with questions about these terms, programme arrangements or your records. These terms do not limit rights you have under applicable law."
  ]
];

export default function TermsAndConditions({ur}:{ur:boolean}){return <div className="terms-content" lang="en" dir="ltr">{sections.map(([title,body])=><section key={title}><h3>{title}</h3><p>{body}</p></section>)}</div>}
