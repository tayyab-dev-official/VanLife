import React from "react"
import { Link, useLocation } from "react-router-dom"

export default function NotFound() {
    const location = useLocation()
    const message = location.state?.message || "Sorry, the page you were looking for was not found."
    
    return (
        <div className="not-found-container">
            <h1>{message}</h1>
            <Link to="/" className="link-button">Return to Home</Link>
        </div>
    )
}
