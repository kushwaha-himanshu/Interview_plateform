import { ArrowRight, LockKeyhole, Mail, UserRound } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import AuthInput from '../components/AuthInput'
import AuthLayout from '../components/AuthLayout'
import GoogleIcon from '../components/GoogleIcon'

export default function Signup() {
  const navigate = useNavigate()
  const submit = (event) => { event.preventDefault(); navigate('/dashboard') }
  return <AuthLayout><div className="auth-title"><h1>Create your account</h1><p>Start preparing for smarter interviews</p></div><form className="auth-form" onSubmit={submit}><AuthInput label="Full Name" icon={UserRound} placeholder="Enter your full name" required /><AuthInput label="Email" icon={Mail} type="email" placeholder="Enter your email" required /><AuthInput label="Password" icon={LockKeyhole} type="password" placeholder="Create a password" required /><AuthInput label="Confirm Password" icon={LockKeyhole} type="password" placeholder="Confirm your password" required /><label className="terms"><input required type="checkbox" /> <span>I agree to the <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a></span></label><button className="auth-submit" type="submit">Create Account <ArrowRight size={18} /></button><div className="auth-divider"><span />or<span /></div><button className="google-button" type="button"><GoogleIcon />Continue with Google</button></form><p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p></AuthLayout>
}
