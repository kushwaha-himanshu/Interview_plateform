import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

export default function AuthInput({ label, icon: Icon, type = 'text', ...props }) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  return <label className="auth-field"><span>{label}</span><div className="auth-input-wrap"><Icon size={19} /><input type={isPassword && showPassword ? 'text' : type} {...props} />{isPassword && <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={19} /> : <Eye size={19} />}</button>}</div></label>
}
