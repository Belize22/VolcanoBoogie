import { useState } from 'react';
import { DragDropProvider } from '@dnd-kit/react';
import Draggable from '@/hooks/draggable';
import Droppable from '@/hooks/droppable';


type Props = {

}

export default function ExplorerSelectionPane({

}: Props) {
    const targets = ['1', '2', '3', '4', '5', '6'];
    const [target, setTarget] = useState<string | number | undefined>();
    const draggable = (
        <Draggable id="draggable">Test</Draggable>
    )    
    const draggable2 = (
        <Draggable id="draggable2">Test 2</Draggable>
    )
    return (
        <div className="bg-stone-700 text-center p-2 m-2 rounded-xl">
            <DragDropProvider
                onDragEnd={(event) => {
                    if (event.canceled) { 
                        return; 
                    }
                    setTarget(event.operation.target?.id)
                }}
            >
                {!target ? draggable : null}

                {targets.map((id) => (
                    <Droppable key={id} id={id}>
                        {target === id ? draggable: `Droppable ${id}`}
                    </Droppable>
                ))}
            </DragDropProvider>
        </div>
    )
}