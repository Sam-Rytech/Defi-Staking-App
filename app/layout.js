import '../styles/globals.css'

export const metadata = {
  title: 'NFT DeFi App',
  description: 'Stake tokens and earn rewards on Base',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white">
        <main className="max-w-4xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  )
}
