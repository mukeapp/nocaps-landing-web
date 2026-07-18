import React from 'react'

interface Props {
    children: React.ReactNode;
}

const AuthLayout = ({ children }: Props) => {
    return (
        <div className="min-h-screen bg-background">
            {children}
        </div>
    )
};

export default AuthLayout
