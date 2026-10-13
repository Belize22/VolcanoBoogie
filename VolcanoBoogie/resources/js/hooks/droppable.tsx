import { useDroppable } from '@dnd-kit/react';

type Props = {
    id: string;
    children: React.ReactNode;
}

export default function Droppable({
    id, 
    children
}: Props) {
    const { ref } = useDroppable({
        id,
    });

    return (
        <div ref={ref} style={{width: 300, height: 30}}>
            {children}
        </div>
    );
}