import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
// import '../styles.pcss'

async function enableMocking() {
    const { worker } = await import('./mocks/browser')

    return worker.start()
}

enableMocking().then(() => {
    ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
        <React.StrictMode>
            <RouterProvider router={router} />
        </React.StrictMode>
    )
})
