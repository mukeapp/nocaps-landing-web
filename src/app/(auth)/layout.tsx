import React from 'react'

interface Props {
    children: React.ReactNode;
}

const AuthLayout = ({ children }: Props) => {
    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#0D0D0D' }}>
            {children}
        </div>
    )
};

export default AuthLayout
