import React, { Dispatch, SetStateAction } from 'react';
import { Dialog, DialogPanel, DialogTitle, Description } from '@headlessui/react';

type Props = {
    title: string,
    description: string,
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    children: React.ReactNode;
}

export default function Modal({
    title,
    description,
    isOpen,
    setIsOpen,
    children
}: Props) {
    return (
        <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

            {/* Modal */}
            <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-stone-800 p-6 text-left align-middle shadow-xl transition-all">
                    <DialogTitle className="text-2xl text-center font-bold text-stone-100">{title}</DialogTitle>
                    <Description className="text-lg text-center text-stone-100">{description}</Description>
                    <hr className="border-t border-stone-100 my-3" />
                    <div>{children}</div>
                </DialogPanel>
            </div>
        </Dialog>
    )
}