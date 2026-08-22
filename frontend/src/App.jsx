import { Route, Routes } from 'react-router-dom'
import Landing from './pages/Landing'

const PlaceholderPage = ({ title }) => <main className="placeholder-page"><h1>{title}</h1><p>This screen will be converted from its Stitch markup next.</p></main>

export default function App() {
  return <Routes>
    <Route path="/" element={<Landing />} />
    <Route path="/login" element={<PlaceholderPage title="Login" />} />
    <Route path="/signup" element={<PlaceholderPage title="Create your account" />} />
    <Route path="/dashboard" element={<PlaceholderPage title="Dashboard" />} />
    <Route path="/resume" element={<PlaceholderPage title="Resume" />} />
    <Route path="/interview/setup" element={<PlaceholderPage title="Start Interview" />} />
    <Route path="/interview" element={<PlaceholderPage title="AI Interview" />} />
    <Route path="/evaluation" element={<PlaceholderPage title="Answer Evaluation" />} />
    <Route path="/analytics" element={<PlaceholderPage title="Analytics" />} />
    <Route path="/report" element={<PlaceholderPage title="Interview Report" />} />
  </Routes>
}
