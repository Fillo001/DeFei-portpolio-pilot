import ChatBot from '../components/ChatBot';
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>DeFAI Portfolio Pilot</title>
        <meta name="description" content="AI-powered DeFi portfolio optimization" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-3xl font-bold mb-4 text-center">DeFAI Portfolio Pilot</h1>
        <p className="mb-6 text-center text-gray-600">Connect your wallet and chat with our AI to optimize your Kaia USDT portfolio.</p>
        <div className="max-w-4xl mx-auto">
          <ChatBot />
        </div>
      </div>
    </>
  );
}
