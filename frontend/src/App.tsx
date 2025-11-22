import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { Session } from '@supabase/supabase-js'

function App() {
    const [session, setSession] = useState<Session | null>(null)
    const [file, setFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)
    const [message, setMessage] = useState('')

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
        })

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })

        return () => subscription.unsubscribe()
    }, [])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0])
        }
    }

    const handleUpload = async () => {
        if (!file || !session) return

        setUploading(true)
        setMessage('')

        const formData = new FormData()
        formData.append('file', file)

        try {
            // Assuming backend is on the same host, port 3000
            // In production/docker, this might need adjustment or a proxy
            const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080/api'

            const response = await fetch(`${backendUrl}/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: formData
            })

            if (response.ok) {
                setMessage('Upload successful! Processing started.')
                setFile(null)
            } else {
                const errorData = await response.json()
                setMessage(`Upload failed: ${errorData.error || 'Unknown error'}`)
            }
        } catch (error) {
            console.error('Upload error:', error)
            setMessage('Upload failed due to network error.')
        } finally {
            setUploading(false)
        }
    }

    if (!session) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
                <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-lg">
                    <h1 className="text-2xl font-bold mb-6 text-center">Search2Plex Login</h1>
                    <Auth
                        supabaseClient={supabase}
                        appearance={{ theme: ThemeSupa }}
                        theme="dark"
                        providers={[]}
                    />
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-2xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Search2Plex</h1>
                    <button
                        onClick={() => supabase.auth.signOut()}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition"
                    >
                        Sign Out
                    </button>
                </div>

                <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold mb-4">Upload CSV</h2>
                    <p className="text-gray-400 mb-6">
                        Upload a CSV file with columns: Index, Title, Artist, Album, Duration, FLAC URL
                    </p>

                    <div className="mb-6">
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-400
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-600 file:text-white
                hover:file:bg-blue-700
              "
                        />
                    </div>

                    <button
                        onClick={handleUpload}
                        disabled={!file || uploading}
                        className={`w-full py-3 rounded font-bold transition ${!file || uploading
                            ? 'bg-gray-600 cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-700'
                            }`}
                    >
                        {uploading ? 'Uploading...' : 'Start Processing'}
                    </button>

                    {message && (
                        <div className={`mt-4 p-4 rounded ${message.includes('failed') ? 'bg-red-900/50 text-red-200' : 'bg-green-900/50 text-green-200'}`}>
                            {message}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default App
