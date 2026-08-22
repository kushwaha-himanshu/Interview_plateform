import { Route, Routes } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Resume from './pages/Resume'
import Interview from './pages/Interview'
import InterviewSetup from './pages/InterviewSetup'
import Evaluation from './pages/Evaluation'
import Analytics from './pages/Analytics'

const PlaceholderPage = ({ title }) => <main className="placeholder-page"><h1>{title}</h1><p>This screen will be converted from its Stitch markup next.</p></main>

export default function App() {
  return <Routes>
    <Route path="/" element={<Landing />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/resume" element={<Resume />} />
    <Route path="/interview/setup" element={<InterviewSetup />} />
    <Route path="/interview" element={<Interview />} />
    <Route path="/evaluation" element={<Evaluation />} />
    <Route path="/analytics" element={<Analytics />} />
    <Route path="/report" element={<PlaceholderPage title="Interview Report" />} />
  </Routes>
}
