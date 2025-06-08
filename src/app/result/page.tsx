"use client";
import { useEffect, useState } from "react";

const faceShapes = [
  "Oblong",
  "Oval",
  "Square",
  "Round",
  "Heart-shaped",
  "Diamond"
];

const shapeMeta: Record<string, {icon:string,desc:string}> = {
  "Oblong": { icon: "https://ext.same-assets.com/2922023174/1244555598.svg", desc: "An oblong face is longer than it is wide, with a forehead, cheekbones, and jawline that are similar in width." },
  "Oval": { icon: "https://ext.same-assets.com/2922023174/13617882.svg", desc: "An oval face is longer than it is wide, with a forehead that's slightly wider than the chin and gentle curves at the sides." },
  "Square": { icon: "https://ext.same-assets.com/2922023174/3184556962.svg", desc: "A square face has a strong jawline with a forehead and jawline that are approximately the same width." },
  "Round": { icon: "https://ext.same-assets.com/2922023174/2861435316.svg", desc: "A round face has soft curves with cheekbones and face length that are roughly the same width." },
  "Heart-shaped": { icon: "https://ext.same-assets.com/2922023174/1424132174.svg", desc: "A heart-shaped face has a wider forehead and cheekbones with a narrow chin, resembling an inverted triangle." },
  "Diamond": { icon: "https://ext.same-assets.com/2922023174/861616377.svg", desc: "A diamond-shaped face has a narrow forehead and jawline with the cheekbones being the widest part of the face, and a pointed chin." }
};

function getSessionId() {
  if (typeof window === 'undefined') return null;
  const url = new URL(window.location.href);
  return url.searchParams.get("session");
}

export default function ResultPage() {
  const [result, setResult] = useState<any|null>(null);
  const [error, setError] = useState<string|null>(null);
  useEffect(() => {
    const session = getSessionId();
    if (!session) { setError("No session ID. Try the tool again."); return; }
    const stored = sessionStorage.getItem(`shape-tool-${session}`);
    if (!stored) { setError("Session expired or missing. Try again."); return; }
    try {
      setResult(JSON.parse(stored));
    } catch {
      setError("Corrupt session data.");
    }
  }, []);
  if (error) return <div className="max-w-lg mx-auto mt-16 text-center"><h1 className="text-xl font-semibold text-red-600 mb-4">Error</h1><div>{error}</div><a className="mt-6 inline-block px-4 py-2 bg-[#a656c2] text-white rounded-xl" href="/">Back to Tool</a></div>;
  if (!result) return <div className="max-w-lg mx-auto mt-24 text-center text-lg text-[#a656c2]">Loading result...</div>;
  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8 items-center">
        <div className="flex-1 flex flex-col items-center gap-3">
          {/* User Image with overlay landmarks if possible */}
          <div className="relative w-[240px] h-[240px]">
            <img src={result.imageUrl} alt="User" className="rounded-lg shadow max-w-full h-auto" />
            {result.overlayData && (<canvas width={240} height={240} style={{position:'absolute',top:0,left:0,pointerEvents:'none'}} />)}
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex flex-row gap-3 items-center md:items-start">
            <img src={shapeMeta[result.shape].icon} alt="icon" width={54} height={54} />
            <div>
              <div className="text-lg tracking-wide font-semibold text-[#a656c2]">Your face shape:</div>
              <div className="text-3xl font-extrabold text-[#453670] mb-1">{result.shape}</div>
            </div>
          </div>
          <div className="text-[#6c6a74] mb-6">{shapeMeta[result.shape].desc}</div>
          <div className="flex flex-row gap-2 items-end text-sm w-full">
            {/* Score bar breakdown */}
            <div className="flex flex-col gap-1 w-full">
              {faceShapes.map(shape=>(
                <div key={shape} className="flex gap-2 items-center">
                  <div className="w-28 shrink-0 flex gap-1 items-center"><img src={shapeMeta[shape].icon} width={22} height={22} alt=""/> {shape}</div>
                  <div className="bg-[#c9c8ca]/30 flex-1 rounded-r h-3 relative"><div className="absolute top-0 left-0 h-3 bg-[#a656c2] rounded-r" style={{width:(result.shapeScores?Math.round(result.shapeScores[shape]*100):0)+"%"}}></div></div>
                  <div style={{width:28,textAlign:'right'}}>{result.shapeScores?Math.round(result.shapeScores[shape]*100):0}%</div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-row gap-3 mt-6">
            <a href="/" className="bg-[#a656c2] px-4 py-2 rounded text-white font-semibold">Analyze another photo</a>
            <button onClick={()=>{navigator.clipboard.writeText(window.location.href)}} className="bg-[#9b999a] px-4 py-2 rounded text-white font-semibold">Share result link</button>
          </div>
        </div>
      </div>
    </div>
  );
}
