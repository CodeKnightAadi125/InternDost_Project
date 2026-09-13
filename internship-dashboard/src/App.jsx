import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import InternshipList from './components/InternshipList'
import Login from './components/Login'
import Contact from './components/Contact'

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    // Applied the new dark theme class here!
    <div className="dark-theme-layout">

      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setSearchTerm={setSearchTerm}
      />

      <main style={{ padding: '0 40px', maxWidth: '1200px', margin: '0 auto' }}>
        {activeTab === 'home' && (
          <HeroSection
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'internships' && (
          <InternshipList
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        )}

        {activeTab === 'login' && (
          <Login setActiveTab={setActiveTab} />
        )}

        {activeTab === 'contact' && (
          <Contact />
        )}
      </main>
    </div>
  )
}

export default App