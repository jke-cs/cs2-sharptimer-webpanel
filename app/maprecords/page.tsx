import Header from '@/components/Header'
import Footer from '@/components/Footer'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <LoadingSpinner/>
      </main>

      <Footer />
    </div>
  )
}