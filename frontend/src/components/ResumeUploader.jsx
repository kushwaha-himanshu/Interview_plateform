import { CloudUpload, FileText, Upload } from 'lucide-react'
import { useRef, useState } from 'react'

export default function ResumeUploader() {
  const inputRef = useRef(null)
  const [fileName, setFileName] = useState('')
  const chooseFile = (file) => { if (file) setFileName(file.name) }
  return <section className="resume-uploader dashboard-card" onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); chooseFile(event.dataTransfer.files[0]) }}><input ref={inputRef} type="file" accept=".pdf,.doc,.docx" onChange={(event) => chooseFile(event.target.files[0])} hidden />{fileName ? <><FileText className="upload-icon" size={48} /><h3>{fileName}</h3><p>Ready for analysis</p></> : <><span className="upload-round"><CloudUpload size={38} /></span><h3>Drop your resume here</h3><p>PDF, DOCX (Max 10MB)</p></>}<button onClick={() => inputRef.current?.click()}><Upload size={17} />{fileName ? 'Choose Another File' : 'Browse Files'}</button></section>
}
