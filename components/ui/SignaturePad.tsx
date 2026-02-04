'use client';

import { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Eraser, Check } from 'lucide-react';

interface SignaturePadProps {
    onSave: (signatureData: string) => void;
    onClear?: () => void;
    width?: number;
    height?: number;
}

export function SignaturePad({ onSave, onClear, width = 400, height = 200 }: SignaturePadProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasSignature, setHasSignature] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#0f172a'; // dark slate for light mode, handle dark mode later if needed via props or context
    }, []);

    // Helper to get coordinates for both touch and mouse events
    const getCoordinates = (event: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };

        const rect = canvas.getBoundingClientRect();
        let clientX, clientY;

        if ('touches' in event) {
            clientX = event.touches[0].clientX;
            clientY = event.touches[0].clientY;
        } else {
            clientX = (event as React.MouseEvent).clientX;
            clientY = (event as React.MouseEvent).clientY;
        }

        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    };

    const startDrawing = (event: React.MouseEvent | React.TouchEvent) => {
        setIsDrawing(true);
        const { x, y } = getCoordinates(event);
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) {
            ctx.beginPath();
            ctx.moveTo(x, y);
        }
    };

    const draw = (event: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        event.preventDefault(); // Prevent scrolling on touch devices

        const { x, y } = getCoordinates(event);
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) {
            ctx.lineTo(x, y);
            ctx.stroke();
            if (!hasSignature) setHasSignature(true);
        }
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (canvas && ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            setHasSignature(false);
            if (onClear) onClear();
        }
    };

    const handleSave = () => {
        if (canvasRef.current) {
            const dataUrl = canvasRef.current.toDataURL('image/png');
            onSave(dataUrl);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="border border-border dark:border-border-dark rounded-xl overflow-hidden bg-white shadow-sm touch-none">
                <canvas
                    ref={canvasRef}
                    width={width}
                    height={height}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="cursor-crosshair w-full max-w-full"
                    style={{ width: '100%', height: 'auto', maxHeight: height }}
                />
            </div>
            <div className="flex gap-3 w-full justify-center">
                <Button variant="outline" size="sm" onClick={clearCanvas} leftIcon={<Eraser className="h-4 w-4" />}>
                    Clear
                </Button>
                <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSave}
                    disabled={!hasSignature}
                    leftIcon={<Check className="h-4 w-4" />}
                >
                    Confirm Signature
                </Button>
            </div>
        </div>
    );
}
