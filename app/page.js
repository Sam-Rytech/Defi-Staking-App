import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="text-center space-y-6">
      <h1 className="text-4xl font-bold">NFT DeFi Staking App</h1>
      <p className="text-lg">
        Stake your Builder Tokens and earn rewards on Base Sepolia
      </p>
      <Link href="/stake">
        <button className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded text-white font-semibold">
          Go to Staking Dashboard
        </button>
      </Link>
    </div>
  )
}
