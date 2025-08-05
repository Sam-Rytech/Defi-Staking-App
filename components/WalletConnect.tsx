'use client'

import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function WalletConnect({
  onConnect,
}: {
  onConnect: (
    address: string,
    provider: ethers.BrowserProvider,
    signer: ethers.Signer
  ) => void
}) {
  const [address, setAddress] = useState('')

  const connectWallet = async () => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum)
      await provider.send('eth_requestAccounts', [])
      const signer = await provider.getSigner()
      const addr = await signer.getAddress()
      setAddress(addr)
      onConnect(addr, provider, signer)
    } else {
      alert('Install MetaMask')
    }
  }

  return (
    <div className="mb-6">
      {address ? (
        <span className="text-green-500 font-medium">
          Connected: {address.slice(0, 6)}...{address.slice(-4)}
        </span>
      ) : (
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      )}
    </div>
  )
}
