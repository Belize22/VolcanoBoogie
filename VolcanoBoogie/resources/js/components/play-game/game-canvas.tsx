import { useEffect } from 'react';

type Props = {
    gameCanvasRef: React.RefObject<HTMLCanvasElement | null>
};

export default function GameCanvas({
    gameCanvasRef
}: Props) {
    function initializeCanvas() {
        if (gameCanvasRef.current !== null) {
            const context = gameCanvasRef.current.getContext("2d");
            if (context) {
                const width = gameCanvasRef.current.width;
                const height = gameCanvasRef.current.height;

                context.fillStyle = 'red';
                context.fillRect(0, 0, width, height);

                let rows = 10
                let columns = 10

                for (let i = 1; i < rows; i++) {
                    context.strokeStyle = 'white';
                    context.beginPath();
                    context.setLineDash([5, 2]);
                    context.moveTo(i * width/10, 0);
                    context.lineTo(i * width/10, height);
                    context.stroke();
                }

                for (let i = 1; i < columns; i++) {
                    context.strokeStyle = 'white';
                    context.beginPath();
                    context.setLineDash([5, 2]);
                    context.moveTo(0, i * height/10);
                    context.lineTo(width, i * height/10);
                    context.stroke();
                }
            }
        }
    }

    useEffect(() => {
        initializeCanvas();
    }, [])

    return (
        <>
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <canvas id="gameCanvas" width="1080" height="720" ref={gameCanvasRef}></canvas>
            </div>
        </>
    );
}