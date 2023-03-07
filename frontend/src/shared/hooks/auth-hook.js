import { useState, useEffect, useCallback } from "react";

let logoutTimer;

export const useAuth = () => {
    const [token, setToken] = useState(null);
    const [tokenExpirationDate, setTokenExpirationDate] = useState();
    const [userId, setUserId] = useState(null);
    const [userName, setUserName] = useState(false);
    const [userImage, setUserImage] = useState();


    const login = useCallback((uid, uname, token, uimage, expirationDate) => {
        setUserId(uid);
        setUserName(uname);
        setToken(token);
        setUserImage(uimage);
        const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 7); //exp in 1week
        setTokenExpirationDate(tokenExpirationDate);
        localStorage.setItem('userData',
            JSON.stringify({
                userId: uid,
                userName: uname,
                token: token,
                userImage: uimage,
                expiration: tokenExpirationDate.toISOString()
            }));
    }, []);

    const logout = useCallback(() => {
        setToken(null);
        setTokenExpirationDate(null);
        setUserId(null);
        setUserName(null);
        setUserImage(null);
        localStorage.removeItem('userData');
    }, []);

    useEffect(() => {
        if (token && tokenExpirationDate) {
            const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
            logoutTimer = setTimeout(logout, remainingTime);
        } else {
            clearTimeout(logoutTimer);
        }
    }, [token, logout, tokenExpirationDate]);

    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem('userData'));
        if (storedData && storedData.token && new Date(storedData.expiration) > new Date()) {
            login(storedData.userId,
                storedData.userName,
                storedData.token,
                storedData.userImage,
                new Date(storedData.expiration));
        }
    }, [login]);

    return { token, login, logout, userId, userName, userImage };
};