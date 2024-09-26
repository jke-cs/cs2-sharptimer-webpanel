import Leaderboard from '@/components/Leaderboard'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function LeaderboardPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <Header />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Leaderboard />
        </div>
      </main>
      <Footer />
    </div>
  )
}