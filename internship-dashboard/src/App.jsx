import { useState } from 'react'
import './App.css'
import AdminDashboard from './components/AdminDashboard'  
import Profile from './components/Profile'
import HeroSection from './components/HeroSection'
import InternshipList from './components/InternshipList'
import Login from './components/Login'
import Contact from './components/Contact'
import EmployerRequest from './components/EmployerRequest'
import Chatbot from './components/Chatbot'
import { AuthProvider, useAuth } from './components/AuthContext'
import SidebarLayout from './components/SidebarLayout'

function AppContent() {
  const [activeTab, setActiveTab] = useState('home');
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();

  return (
    <SidebarLayout activeTab={activeTab} setActiveTab={setActiveTab} user={user}>
      {activeTab === 'home' && (
        <HeroSection searchTerm={searchTerm} setSearchTerm={setSearchTerm} setActiveTab={setActiveTab} />
      )}
      {activeTab === 'internships' && (
        <div style={{ padding: '0 40px', maxWidth: '1200px', margin: '0 auto' }}>
          <InternshipList searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>
      )}
      {activeTab === 'profile' && (
        <Profile setActiveTab={setActiveTab} />
      )}
      {activeTab === 'contact' && (
        <Contact />
      )}
      {activeTab === 'employer_request' && (
        <EmployerRequest />
      )}
      {activeTab === 'login' && (
        <Login setActiveTab={setActiveTab} />
      )}
      
      {/* Admin Routes */}
      {['admin_dashboard', 'admin_publish', 'admin_manage', 'admin_applications', 'admin_messages', 'admin_employer_requests', 'admin_admins', 'admin'].includes(activeTab) && (
         <AdminDashboard activeTab={activeTab === 'admin' ? 'admin_dashboard' : activeTab} setActiveTab={setActiveTab} />
      )}
      <Chatbot />
    </SidebarLayout>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App