import React from 'react';import {createRoot} from 'react-dom/client';import SubscribeForm from '../../app/subscribe-form';
createRoot(document.getElementById('root')!).render(<SubscribeForm settings={{footerSubscribeTitle:'Updates',footerSubscribeBody:'Subscription test'}} ur={false}/>);
