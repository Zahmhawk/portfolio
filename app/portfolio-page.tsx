import {getChatGPTUser} from './chatgpt-auth';
import Portfolio from './portfolio';import {publicData} from '../lib/server';
export const dynamic='force-dynamic';
export default async function PortfolioPage({page='home'}:{page?:string}){const [data,user]=await Promise.all([publicData(),getChatGPTUser()]);return <Portfolio page={page} initial={{...data,signedIn:!!user}}/>}
