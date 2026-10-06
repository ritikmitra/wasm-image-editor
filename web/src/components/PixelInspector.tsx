import { useEffect, useRef, useState } from "react";

export default function PixelInspector() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageDataRef = useRef<ImageData | null>(null);

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [pixel, setPixel] = useState({
    x: 0,
    y: 0,
    r: 0,
    g: 0,
    b: 0,
    a: 0
  });

  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  const resetImage = () => {
    const canvas = canvasRef.current;
    const imageData = imageDataRef.current;

    const ctx = canvas?.getContext("2d");

    if (!canvas || !imageData || !ctx) return;

    ctx.putImageData(imageData, 0, 0);


  }

  const applyGrayScale = () => {
    const canvas = canvasRef.current;
    const imageData = imageDataRef.current;

    const copyImageData = new ImageData(
      new Uint8ClampedArray(imageData?.data || []),
      imageData?.width || 0,
      imageData?.height || 0
    );

    if (!canvas || !imageData) return;

    const ctx = canvas.getContext("2d");

    const start = performance.now()

    for (let i = 0; i < imageData.data.length; i += 4) {
      const R = imageData.data[i];
      const G = imageData.data[i + 1];
      const B = imageData.data[i + 2];
      const gray = 0.299 * R + 0.587 * G + 0.114 * B;
      copyImageData.data[i] = gray
      copyImageData.data[i + 1] = gray
      copyImageData.data[i + 2] = gray
    }

    console.log(`grayscale: ${(performance.now() - start).toFixed(2)} ms`);

    ctx?.putImageData(copyImageData, 0, 0);
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const url = URL.createObjectURL(file);

    setImageUrl(url);
    setPixel({
      x: 0,
      y: 0,
      r: 0,
      g: 0,
      b: 0,
      a: 0
    });

    const img = new Image();

    img.onload = () => {
      const canvas = canvasRef.current;

      if (!canvas) return;

      // Set canvas to the image's natural dimensions
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      const ctx = canvas.getContext("2d", { willReadFrequently: true });

      if (!ctx) return;

      // Draw image onto canvas
      ctx.drawImage(img, 0, 0);

      // Read all pixels
      const imageData = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      );

      imageDataRef.current = imageData;

      console.log("width:", imageData.width);
      console.log("height:", imageData.height);
      console.log("data.length:", imageData.data.length);

      const expectedLength =
        imageData.width * imageData.height * 4;

      console.log("expected:", expectedLength);
      console.log(
        "length matches:",
        imageData.data.length === expectedLength
      );
    };

    img.src = url;
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const imageData = imageDataRef.current;

    if (!canvas || !imageData) return;

    const rect = canvas.getBoundingClientRect();
    console.log("canvas rect:", rect);

    // Convert screen coordinates to actual canvas coordinates
    const x = Math.floor(
      ((event.clientX - rect.left) / rect.width) *
      canvas.width
    );

    const y = Math.floor(
      ((event.clientY - rect.top) / rect.height) *
      canvas.height
    );

    // Each pixel contains 4 values: R, G, B, A
    const index = (y * imageData.width + x) * 4;

    const r = imageData.data[index];
    const g = imageData.data[index + 1];
    const b = imageData.data[index + 2];
    const a = imageData.data[index + 3];

    setPixel({
      x,
      y,
      r,
      g,
      b,
      a,
    });
  };

  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">
        Pixel Inspector
      </h1>

      {/* File input */}
      <div className="mb-6">
        <label
          htmlFor="image-upload"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Choose an image
        </label>

        <input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full max-w-md cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 file:mr-4 file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-white hover:file:bg-blue-700"
        />

        <button onClick={applyGrayScale} className="mt-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          Apply Gray Scale
        </button>

        {/* reset button */}
        <button onClick={resetImage} className="mt-2 rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700">
          Reset Image
        </button>
      </div>

      {/* Canvas */}
      {imageUrl && (
        <div className="overflow-auto rounded-lg border border-gray-300 bg-gray-100 p-2">
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            className="block h-auto max-w-full cursor-crosshair"
          />
        </div>
      )}

      {/* Pixel information */}
      {pixel && (
        <div className="mt-6 flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          {/* Colour swatch */}
          <div
            className="h-14 w-14 shrink-0 rounded-lg border border-gray-300 shadow-inner"
            style={{
              backgroundColor: `rgba(${pixel.r}, ${pixel.g}, ${pixel.b}, ${pixel.a / 255
                })`,
            }}
          />

          <div className="text-sm text-gray-700">
            <p className="font-semibold text-gray-900">
              Selected Pixel
            </p>

            <p>
              Position:{" "}
              <span className="font-mono">
                ({pixel.x}, {pixel.y})
              </span>
            </p>

            <p>
              RGBA:{" "}
              <span className="font-mono">
                ({pixel.r}, {pixel.g}, {pixel.b}, {pixel.a})
              </span>
            </p>

            <p>
              HEX:{" "}
              <span className="font-mono">
                #
                {[pixel.r, pixel.g, pixel.b]
                  .map((value) =>
                    value.toString(16).padStart(2, "0")
                  )
                  .join("")
                  .toUpperCase()}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
