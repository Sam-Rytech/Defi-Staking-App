'use client'

import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import WalletConnect from '../../components/WalletConnect'
import {
  STAKING_ABI,
  TOKEN_ABI,
  STAKING_CONTRACT_ADDRESS,
  TOKEN_CONTRACT_ADDRESS,
} from '../../lib/contract'

export default function StakePage() {
  const [provider, setProvider] = useState<ethers.BrowserProvider>()
  const [signer, setSigner] = useState<ethers.Signer>()
  const [address, setAddress] = useState('')
  const [stakingContract, setStakingContract] = useState<any>()
  const [tokenContract, setTokenContract] = useState<any>()

  const [amount, setAmount] = useState('')
  const [staked, setStaked] = useState('0')
  const [rewards, setRewards] = useState('0')
  const [history, setHistory] = useState<string[]>([])

  const handleConnect = async (
    addr: string,
    provider: ethers.BrowserProvider,
    signer: ethers.Signer
  ) => {
    setAddress(addr)
    setProvider(provider)
    setSigner(signer)

    const token = new ethers.Contract(TOKEN_CONTRACT_ADDRESS, TOKEN_ABI, signer)
    const staking = new ethers.Contract(
      STAKING_CONTRACT_ADDRESS,
      STAKING_ABI,
      signer
    )

    setTokenContract(token)
    setStakingContract(staking)

    const info = await staking.getUserInfo(addr)
    setStaked(ethers.formatEther(info[0]))
    setRewards(ethers.formatEther(info[1]))
  }

  const stakeTokens = async () => {
    if (!tokenContract || !stakingContract || !amount) return

    const parsed = ethers.parseEther(amount)
    const tx1 = await tokenContract.approve(STAKING_CONTRACT_ADDRESS, parsed)
    await tx1.wait()
    setHistory((prev) => [`✅ Approved ${amount} tokens`, ...prev])

    const tx2 = await stakingContract.stake(parsed)
    await tx2.wait()
    setHistory((prev) => [`✅ Staked ${amount} tokens`, ...prev])
  }

  const claimRewards = async () => {
    const tx = await stakingContract.claimReward()
    await tx.wait()
    setHistory((prev) => ['💰 Rewards claimed!', ...prev])
  }

  const unstake = async () => {
    if (!amount) return
    const parsed = ethers.parseEther(amount)
    const tx = await stakingContract.withdraw(parsed)
    await tx.wait()
    setHistory((prev) => [`⛔ Unstaked ${amount} tokens`, ...prev])
  }



  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Staking Dashboard</h1>

      <WalletConnect onConnect={handleConnect} />

      <div className="space-y-4">
        <div>
          <label className="block mb-1">Amount to Stake</label>
          <input
            type="number"
            placeholder="0.0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded"
          />
        </div>

        <button
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white w-full"
          onClick={stakeTokens}
        >
          Stake Tokens
        </button>

        <button
          className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded text-white w-full"
          onClick={claimRewards}
        >
          Claim Rewards
        </button>

        <button
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white w-full"
          onClick={unstake}
        >
          Unstake
        </button>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Your Stats</h2>
        <p>Staked: {staked} BUILD</p>
        <p>Pending Rewards: {rewards} BUILD</p>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">🧾 Transaction History</h2>
        <ul className="space-y-1">
          {history.map((tx, i) => (
            <li key={i} className="text-sm text-gray-300">
              • {tx}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
