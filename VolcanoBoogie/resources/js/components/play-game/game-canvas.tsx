import { useRef, useEffect } from 'react';

type Props = {
    gameCanvasRef: React.RefObject<HTMLCanvasElement | null>
};

export default function GameCanvas({
    gameCanvasRef
}: Props) {
    const uiOverlayRef = useRef<HTMLCanvasElement | null>(null);

    function initializeCanvas() {
        if (gameCanvasRef.current !== null) {
            const context = gameCanvasRef.current.getContext("2d");
            if (context) {
                const width = gameCanvasRef.current.width;
                const height = gameCanvasRef.current.height;

                context.fillStyle = 'red';
                context.fillRect(0, 0, width, height);

                const image = new Image();
                image.src = 'http://localhost:8000/storage/images/4waysafe.png'
                image.onload = () => {
                    context.drawImage(image, 500, 600)
                };
            }
        }

        if (uiOverlayRef.current !== null) {
            const context = uiOverlayRef.current.getContext("2d");
            if (context) {
                const width = uiOverlayRef.current.width;
                const height = uiOverlayRef.current.height;

                for (let i = 1; i < Math.floor(width/10); i++) {
                    context.strokeStyle = 'white';
                    context.beginPath();
                    context.setLineDash([5, 2]);
                    context.moveTo(i * 100, 0);
                    context.lineTo(i * 100, height);
                    context.stroke();
                }

                for (let i = 1; i < Math.floor(height/10); i++) {
                    context.strokeStyle = 'white';
                    context.beginPath();
                    context.setLineDash([5, 2]);
                    context.moveTo(0, i * 100);
                    context.lineTo(width, i * 100);
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
                <canvas style={{position: "absolute", zIndex: 0}} id="gameCanvas" width="1080" height="720" ref={gameCanvasRef}></canvas>
                <canvas style={{position: "absolute", zIndex: 1}} id="gameCanvas" width="1080" height="720" ref={uiOverlayRef}></canvas>
            </div>
        </>
    );
}