import { useState, useEffect, useRef } from 'react';
import { Dispatch, SetStateAction } from 'react';
import { CircleCheck, CircleX, X } from 'lucide-react'

type Props = {
    status: string,
    message: string,
    isVisible: boolean,
    setIsVisible: Dispatch<SetStateAction<boolean>>;
}

export default function NotificationPopup({
    status,
    message,
    isVisible,
    setIsVisible
}: Props) {
    const POPUP_TIMER = 3000; //in seconds

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, POPUP_TIMER);

        return () => {
            clearTimeout(timer);
        }
    }, [isVisible, message])

    return (
        <>
            {isVisible && 
                <div className="notification-popup">
                    {status === 'success' ? 
                        <div>{<CircleCheck className="text-green-300"></CircleCheck>}</div> :
                        <div>{<CircleX className="text-red-300"></CircleX>}</div>
                    }
                    <div>{message}</div>
                    <div><X onClick={() => {setIsVisible(false)}}></X></div>
                </div>
            }
        </>
    );
}

