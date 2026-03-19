import { useEffect, useRef, useState } from "react";

type Size = { width: number; height: number };
type Position = { x: number; y: number };
type Rect = { x: number; y: number; w: number; h: number };
type ResizeHandle = "nw" | "ne" | "sw" | "se";

type Props = {
  imageSrc: string;
  alt: string;
  disabled?: boolean;
  selected?: boolean;
  style?: React.CSSProperties;
  onImageClick?: () => void;
};

const MIN_SIZE_RATIO = 0.3;
const MAX_SIZE_RATIO = 3;

function clamp(val: number, min: number, max: number) {
  return Math.min(max, Math.max(min, val));
}

export default function ImageTransformViewer({
  imageSrc,
  alt,
  disabled = false,
  selected = false,
  style,
  onImageClick,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [frameSize, setFrameSize] = useState<Size>({ width: 0, height: 0 });
  const [imgRect, setImgRect] = useState<Rect>({ x: 0, y: 0, w: 0, h: 0 });
  const [vpScale, setVpScale] = useState(1);
  const [vpPan, setVpPan] = useState<Position>({ x: 0, y: 0 });

  // Mutable refs to avoid stale closures inside global event handlers
  const frameSizeRef = useRef(frameSize);
  const vpScaleRef = useRef(vpScale);
  const imgRectRef = useRef(imgRect);

  useEffect(() => { frameSizeRef.current = frameSize; }, [frameSize]);
  useEffect(() => { vpScaleRef.current = vpScale; }, [vpScale]);
  useEffect(() => { imgRectRef.current = imgRect; }, [imgRect]);

  const dragRef = useRef<{
    mode: "move" | "resize" | null;
    handle: ResizeHandle | null;
    startMouse: Position;
    startRect: Rect;
  }>({
    mode: null,
    handle: null,
    startMouse: { x: 0, y: 0 },
    startRect: { x: 0, y: 0, w: 0, h: 0 },
  });

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const maxW = Math.min(window.innerWidth * 0.72, 980);
    const maxH = Math.min(window.innerHeight * 0.68, 680);
    const ratio = img.naturalWidth / img.naturalHeight;
    let w = maxW;
    let h = w / ratio;
    if (h > maxH) {
      h = maxH;
      w = h * ratio;
    }
    setFrameSize({ width: w, height: h });
    setImgRect({ x: 0, y: 0, w, h });
    setVpScale(1);
    setVpPan({ x: 0, y: 0 });
  };

  // Non-passive wheel handler — must be attached via addEventListener
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (disabled) return;
      e.preventDefault();
      e.stopPropagation();

      if (e.ctrlKey) {
        // Ctrl + wheel → zoom viewport
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        setVpScale((s) => clamp(s + delta, 0.3, 3));
      } else {
        // Two-finger trackpad → pan viewport
        setVpPan((p) => ({ x: p.x - e.deltaX, y: p.y - e.deltaY }));
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [disabled]);

  // Global mousemove / mouseup — registered once, reads from refs
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const drag = dragRef.current;
      if (!drag.mode) return;

      const scale = vpScaleRef.current;
      const dx = (e.clientX - drag.startMouse.x) / scale;
      const dy = (e.clientY - drag.startMouse.y) / scale;
      const s = drag.startRect;
      const frameW = frameSizeRef.current.width;
      const minW = frameW * MIN_SIZE_RATIO;
      const maxW = frameW * MAX_SIZE_RATIO;
      const ar = s.h / s.w; // height / width aspect ratio

      if (drag.mode === "move") {
        setImgRect({ ...s, x: s.x + dx, y: s.y + dy });
        return;
      }

      let newW: number, newH: number, newX: number, newY: number;

      switch (drag.handle) {
        case "se":
          newW = clamp(s.w + dx, minW, maxW);
          newH = newW * ar;
          newX = s.x;
          newY = s.y;
          break;
        case "sw":
          newW = clamp(s.w - dx, minW, maxW);
          newH = newW * ar;
          newX = s.x + s.w - newW;
          newY = s.y;
          break;
        case "ne":
          newW = clamp(s.w + dx, minW, maxW);
          newH = newW * ar;
          newX = s.x;
          newY = s.y + s.h - newH;
          break;
        case "nw":
          newW = clamp(s.w - dx, minW, maxW);
          newH = newW * ar;
          newX = s.x + s.w - newW;
          newY = s.y + s.h - newH;
          break;
        default:
          return;
      }

      setImgRect({ x: newX, y: newY, w: newW, h: newH });
    };

    const onMouseUp = () => {
      dragRef.current.mode = null;
      dragRef.current.handle = null;
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []); // stable — all values read via refs

  const startMove = (e: React.MouseEvent) => {
    if (disabled) return;
    dragRef.current = {
      mode: "move",
      handle: null,
      startMouse: { x: e.clientX, y: e.clientY },
      startRect: { ...imgRectRef.current },
    };
    e.stopPropagation();
  };

  const startResize = (handle: ResizeHandle, e: React.MouseEvent) => {
    if (disabled) return;
    dragRef.current = {
      mode: "resize",
      handle,
      startMouse: { x: e.clientX, y: e.clientY },
      startRect: { ...imgRectRef.current },
    };
    e.stopPropagation();
    e.preventDefault();
  };

  const handles: { handle: ResizeHandle; left: number; top: number; cursor: string }[] =
    frameSize.width > 0
      ? [
          { handle: "nw", left: imgRect.x, top: imgRect.y, cursor: "nw-resize" },
          { handle: "ne", left: imgRect.x + imgRect.w, top: imgRect.y, cursor: "ne-resize" },
          { handle: "sw", left: imgRect.x, top: imgRect.y + imgRect.h, cursor: "sw-resize" },
          { handle: "se", left: imgRect.x + imgRect.w, top: imgRect.y + imgRect.h, cursor: "se-resize" },
        ]
      : [];

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden rounded-[8px]">
      {/* Invisible sizing image + load trigger */}
      <img
        src={imageSrc}
        alt=""
        onLoad={handleImageLoad}
        draggable={false}
        className="invisible block h-auto w-full"
      />

      {frameSize.width > 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            style={{
              transform: `translate(${vpPan.x}px, ${vpPan.y}px) scale(${vpScale})`,
              transformOrigin: "center center",
              width: frameSize.width,
              height: frameSize.height,
              position: "relative",
              flexShrink: 0,
            }}
          >
            {/* White background frame — clips image when it exceeds bounds */}
            <div className="absolute inset-0 overflow-hidden rounded-[8px] bg-white">
              <div
                className={`absolute ${selected && !disabled ? "cursor-move" : "cursor-pointer"}`}
                style={{
                  left: imgRect.x,
                  top: imgRect.y,
                  width: imgRect.w,
                  height: imgRect.h,
                }}
                onMouseDown={selected && !disabled ? startMove : undefined}
                onClick={(e) => {
                  e.stopPropagation();
                  onImageClick?.();
                }}
              >
                <img
                  src={imageSrc}
                  alt={alt}
                  draggable={false}
                  className="block h-full w-full select-none object-cover"
                  style={style}
                />
              </div>
            </div>

            {/* Selection overlay — rendered outside overflow:hidden so handles are never clipped */}
            {selected && !disabled && (
              <>
                {/* Purple border exactly matching the image bounds */}
                <div
                  className="pointer-events-none absolute border-2 border-[#5C4DFF]"
                  style={{
                    left: imgRect.x,
                    top: imgRect.y,
                    width: imgRect.w,
                    height: imgRect.h,
                  }}
                />

                {/* 4-corner resize handles */}
                {handles.map(({ handle, left, top, cursor }) => (
                  <div
                    key={handle}
                    className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#9CA3AF] bg-white"
                    style={{ left, top, cursor }}
                    onMouseDown={(e) => startResize(handle, e)}
                  />
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
