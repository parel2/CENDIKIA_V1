import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { Eraser } from 'lucide-react';

export interface DrawingPadHandle {
  clear: () => void;
  isEmpty: () => boolean;
  getDataURL: () => string;
  compareWith: (target: string) => number;
}

interface Props {
  className?: string;
  width?: number;
  height?: number;
}

const DrawingPad = forwardRef<DrawingPadHandle, Props>(function DrawingPad(
  { className = '', width = 400, height = 250 },
  ref
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const drawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 4;
    ctxRef.current = ctx;
  }, []);

  function getPos(e: React.PointerEvent): { x: number; y: number } {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }

  function startDraw(e: React.PointerEvent) {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture(e.pointerId);
    drawingRef.current = true;
    const pos = getPos(e);
    lastPointRef.current = pos;
    const ctx = ctxRef.current;
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    }
  }

  function draw(e: React.PointerEvent) {
    if (!drawingRef.current) return;
    e.preventDefault();
    const ctx = ctxRef.current;
    if (!ctx) return;
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastPointRef.current = pos;
    if (!hasDrawn) setHasDrawn(true);
  }

  function endDraw(e: React.PointerEvent) {
    e.preventDefault();
    drawingRef.current = false;
    lastPointRef.current = null;
  }

  useImperativeHandle(ref, () => ({
    clear: () => {
      const ctx = ctxRef.current;
      const canvas = canvasRef.current;
      if (!ctx || !canvas) return;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      setHasDrawn(false);
    },
    isEmpty: () => !hasDrawn,
    getDataURL: () => {
      const canvas = canvasRef.current;
      if (!canvas) return '';
      return canvas.toDataURL('image/png');
    },
    compareWith: (target: string) => {
      return compareImages(canvasRef.current!, target);
    },
  }));

  return (
    <div className={className}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onPointerDown={startDraw}
        onPointerMove={draw}
        onPointerUp={endDraw}
        onPointerLeave={endDraw}
        className="w-full rounded-xl border-2 border-slate-300 bg-white touch-none cursor-crosshair"
        style={{ aspectRatio: `${width}/${height}` }}
      />
      {hasDrawn && (
        <button
          onClick={() => {
            const ctx = ctxRef.current;
            const canvas = canvasRef.current;
            if (!ctx || !canvas) return;
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            setHasDrawn(false);
          }}
          className="mt-2 text-sm text-slate-500 flex items-center gap-1 hover:text-red-500"
        >
          <Eraser className="w-4 h-4" /> Hapus gambar
        </button>
      )}
    </div>
  );
});

export default DrawingPad;

function compareImages(canvas: HTMLCanvasElement, targetDataURL: string): number {
  const target = new Image();
  target.src = targetDataURL;
  if (!target.complete || target.naturalWidth === 0) return 0;

  const off = document.createElement('canvas');
  off.width = canvas.width;
  off.height = canvas.height;
  const offCtx = off.getContext('2d');
  if (!offCtx) return 0;
  offCtx.fillStyle = '#ffffff';
  offCtx.fillRect(0, 0, off.width, off.height);
  offCtx.drawImage(target, 0, 0, off.width, off.height);

  const a = canvas.getContext('2d')!.getImageData(0, 0, canvas.width, canvas.height);
  const b = offCtx.getImageData(0, 0, off.width, off.height);

  let match = 0;
  let totalPixels = 0;
  const step = 4;

  for (let y = 0; y < canvas.height; y += step) {
    for (let x = 0; x < canvas.width; x += step) {
      const i = (y * canvas.width + x) * 4;
      const darkA = a.data[i] < 128 || a.data[i + 1] < 128 || a.data[i + 2] < 128;
      const darkB = b.data[i] < 128 || b.data[i + 1] < 128 || b.data[i + 2] < 128;
      if (darkA === darkB) match++;
      totalPixels++;
    }
  }
  return totalPixels > 0 ? Math.round((match / totalPixels) * 100) : 0;
}
