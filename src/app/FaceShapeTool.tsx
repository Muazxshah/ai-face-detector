'use client';
import { useRef, useState, useEffect } from 'react';
import * as faceapi from 'face-api.js';
import { useRouter } from 'next/navigation';

function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}
function uuid() {
  return Math.random().toString(36).slice(2,10)+(Date.now()%100000);
}

function makeShapeScores(mainShape: string) {
  const shapes = ['Oblong','Oval','Square','Round','Heart-shaped','Diamond'];
  const neighbors: Record<string, string[]> = {
    'Oblong': ['Oval','Square'],
    'Oval': ['Oblong','Round'],
    'Square': ['Oblong','Round'],
    'Round': ['Oval','Square'],
    'Heart-shaped': ['Oval','Diamond'],
    'Diamond': ['Oval','Heart-shaped'],
  };
  const scores: Record<string, number> = {};
  const primary = Math.random() * 0.19 + 0.63; // 63%–82%
  let rest = 1-primary;
  const sec = neighbors[mainShape]?.[0];
  const thd = neighbors[mainShape]?.[1];
  const secondary = Math.random()*0.12 + 0.08; // 8–20%
  rest -= secondary;
  const tertiary = Math.random()*rest*0.9; // remaining gets sub portion
  rest -= tertiary;
  shapes.forEach(s=>scores[s]=0.03+Math.random()*0.04); // minimum noise
  scores[mainShape]=primary;
  if(sec) scores[sec]+=secondary;
  if(thd) scores[thd]+=tertiary;
  const sum = Object.values(scores).reduce((a,b)=>a+b,0);
  shapes.forEach(s=>scores[s]/=sum); // normalize
  return scores;
}

export default function FaceShapeTool() {
  const [file, setFile] = useState<File|null>(null);
  const [imageUrl, setImageUrl] = useState<string|null>(null);
  const [base64, setBase64] = useState<string|null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [scanPos, setScanPos] = useState(0);
  const [scanActive, setScanActive] = useState(false);
  const [error, setError] = useState<string|null>(null);
  const [models, setModels] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();

  // Laser scan animation
  useEffect(() => {
    let raf: number;
    let start: number|null = null;
    function animate(ts: number) {
      if (!start) start = ts;
      const progress = ((ts - start) / 900) % 1;
      setScanPos(progress);
      raf = requestAnimationFrame(animate);
    }
    if (isLoading) {
      setScanActive(true);
      raf = requestAnimationFrame(animate);
    } else {
      setScanActive(false);
      setScanPos(0);
      if(raf) cancelAnimationFrame(raf);
    }
    return () => raf&&cancelAnimationFrame(raf);
  }, [isLoading]);

  // Always stops isLoading and scanActive after n ms
  function failSafeLoadingCleanup(timeoutMs = 8000) {
    setTimeout(()=>{
      setIsLoading(false);
      setScanActive(false);
    }, timeoutMs);
  }

  // Robust, timeout-failsafe model load
  async function ensureModels(timeoutMs = 5000) {
    if (models) return;
    let timeout: NodeJS.Timeout|number;
    try {
      const MODEL_URL = '/models';
      // Start timeout
      const modelPromise = Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL)
      ]);
      const timeoutPromise = new Promise((_, reject) =>
        timeout = setTimeout(() => reject(new Error('Model load timed out: /public/models/ missing or not reachable.')), timeoutMs)
      );
      await Promise.race([modelPromise, timeoutPromise]);
      clearTimeout(timeout as number);
      setModels(true);
    } catch (e:any) {
      setError('Face detection models failed to load: ' + (e.message||e));
      setIsLoading(false); setScanActive(false);
      throw e;
    }
  }

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]||null;
    setError(null);
    setFile(f);
    if (f) {
      setImageUrl(URL.createObjectURL(f));
      setBase64(await toBase64(f));
      const ctx = canvasRef.current?.getContext('2d');
      if(ctx) ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
    } else {
      setImageUrl(null); setBase64(null);
    }
  }

  async function onDetect() {
    setIsLoading(true); setError(null); failSafeLoadingCleanup();
    try {
      await ensureModels();
      if (!imageRef.current || !base64 || !file) throw new Error("No image!");
      // Wait until the <img> has loaded (browsers can be async):
      if (!imageRef.current.complete) {
        await new Promise(resolve => imageRef.current!.onload = resolve);
      }
      const det = await faceapi.detectSingleFace(imageRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks(true);
      if(!det || !det.landmarks) throw new Error("No face detected. Try another image.");
      // just a demo heuristic:
      const pts = det.landmarks.positions;
      const w = Math.abs(pts[0].x-pts[16].x); const h = Math.abs(pts[8].y-pts[27].y);
      let shape = 'Oval';
      if (w/h>0.9) shape='Round';
      if (h/w>1.2) shape='Oblong';
      if (Math.abs(w-h)<20) shape='Square';
      const session = uuid();
      const shapeScores=makeShapeScores(shape);
      sessionStorage.setItem(`shape-tool-${session}`, JSON.stringify({imageUrl: base64,shape,shapeScores}));
      setIsLoading(false); setScanActive(false);
      router.push(`/result?session=${session}`);
    } catch (e:any) {
      setError(e.message||'Face analysis failed.');
      setIsLoading(false); setScanActive(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <input type="file" accept="image/*" className="mb-2" onChange={onFileChange} />
      {imageUrl && (
        <div className="relative mb-2" style={{width:240,height:240}}>
          <img src={imageUrl} ref={imageRef} alt="Upload preview" crossOrigin="anonymous" className="rounded shadow object-cover w-[240px] h-[240px]" />
          <canvas ref={canvasRef} className="absolute top-0 left-0 pointer-events-none w-full h-full" width={240} height={240}/>
          {scanActive && (
            <div className="absolute left-0 w-full" style={{top:`${Math.round(scanPos*220)+10}px`,height:'6px',zIndex:20}}>
              <div className="w-full h-full bg-gradient-to-b from-red-700 via-red-500 to-red-700 opacity-90 rounded-full animate-pulse border border-red-400 shadow-lg" style={{boxShadow:'0 0 18px 3px #f44040'}} />
            </div>
          )}
        </div>
      )}
      <button className="bg-[#a656c2] text-white px-5 py-2 rounded shadow hover:bg-[#453670] text-lg font-medium mt-2" disabled={isLoading || !file} onClick={onDetect}>
        {isLoading ? "Detecting..." : "Detect Face Shape"}
      </button>
      <div className="text-center text-[#9b999a] text-sm mt-2 min-h-[24px]">
        {error && <span className="text-red-500">{error}</span>}
        {imageUrl&&!isLoading&&!error&&"Ready to analyze. Click 'Detect Face Shape'."}
        {!imageUrl&&!error&&"No image uploaded."}
      </div>
    </div>
  );
}
