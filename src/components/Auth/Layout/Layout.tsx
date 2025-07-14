import React, {useEffect, useState, type JSX, type ReactNode } from 'react'
import { useSelector } from 'react-redux'
import { type RootState } from '../../../store/store'
import { useNavigate } from 'react-router-dom'

interface ProtectedProps {
    authentication: boolean,
    children: ReactNode
}

export default function Protected({
    children,
    authentication = false
}: Readonly<ProtectedProps>): JSX.Element {

    const isAuthenticated = useSelector((state: RootState) => state.auth.status)
    const [loader, setLoader] = useState(true);
    const navigator = useNavigate();

    const handleAuthenticatedNavigation = () => {
        if (!isAuthenticated) {
            navigator("/login");
        }
    };

    const handleUnauthenticatedNavigation = () => {
        if (isAuthenticated) {
            navigator("/");
        }
    };

    useEffect(() => {
        if (authentication) {
            handleAuthenticatedNavigation();
        } else {
            handleUnauthenticatedNavigation();
        }
        setLoader(false)
    }, [navigator, authentication, isAuthenticated]);

    return loader ? <h1>loading...</h1> : <div>{children}</div>;

}