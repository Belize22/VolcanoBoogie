import { useDraggable } from '@dnd-kit/react';

type Props = {
    id: string;
    children: React.ReactNode;
}

export default function Draggable({
    id,
    children
}: Props) {
    const { ref } = useDraggable({
        id: 'draggable',
    });

    return (
        <button ref={ref}>
            {children}
        </button>
    );
}