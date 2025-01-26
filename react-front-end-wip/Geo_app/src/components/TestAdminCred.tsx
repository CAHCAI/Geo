import React, { useState, useEffect, FC } from 'react'
import axios, { AxiosResponse } from 'axios'

interface DevCredentialsResponse {
  admin_username?: string
  admin_password?: string
  error?: string
}

// For convenience, define how your local state will be stored.
// We'll keep it simple with partials, since the response might contain `error`.
interface Credentials {
  admin_username: string
  admin_password: string
}

const TestAdminCredentials: FC = () => {
  const [creds, setCreds] = useState<Credentials>({
    admin_username: '',
    admin_password: ''
  })

  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    axios
      .get<DevCredentialsResponse>('/api/dev-credentials')
      .then((res: AxiosResponse<DevCredentialsResponse>) => {
        if (res.data.error) {
          setError(res.data.error)
        } else {
          setCreds({
            admin_username: res.data.admin_username || '',
            admin_password: res.data.admin_password || ''
          })
        }
      })
      .catch((err: any) => {
        console.error(err)
        setError('Could not retrieve credentials.')
      })
  }, [])

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>
  }

  return (
    <div>
      <h2>Admin Credentials (DEV ONLY)</h2>
      <p>Username: {creds.admin_username}</p>
      <p>Password: {creds.admin_password}</p>
    </div>
  )
}

export default TestAdminCredentials
