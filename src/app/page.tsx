import Image from "next/image";
import FaceShapeTool from "./FaceShapeTool";
import Link from 'next/link';
import { blogs } from './blog/data';

const faceShapes = [
  {
    name: "Oblong",
    desc:
      "The oblong face shape, defined by its longer-than-wide proportions and straight cheek lines, radiates sophistication and elegance. People with oblong faces are encouraged to try hairstyles or glasses that add width and volume, balancing their vertical features for a harmonious look.",
    src: "https://ext.same-assets.com/2922023174/1244555598.svg",
  },
  {
    name: "Oval",
    desc:
      "An oval face has smooth contours and perfect balance between width and length. Loved for its versatility, this face shape suits almost every hairstyle, glasses frame, or makeup style, making it a universal favorite in beauty and fashion advice.",
    src: "https://ext.same-assets.com/2922023174/13617882.svg",
  },
  {
    name: "Square",
    desc:
      "Square face shapes are recognized by their bold, angular jawlines and even width from forehead to jaw. This design projects confidence and works best with styles that add softness, such as layered haircuts or rounded glasses.",
    src: "https://ext.same-assets.com/2922023174/3184556962.svg",
  },
  {
    name: "Round",
    desc:
      "The round face features full cheeks, a rounded chin, and equal length and width, often creating a youthful or approachable appearance. Styles that add height and elongate the silhouette are especially flattering for round faces.",
    src: "https://ext.same-assets.com/2922023174/2861435316.svg",
  },
  {
    name: "Heart-shaped",
    desc:
      "Heart-shaped faces are unmistakable, combining a wider forehead, prominent cheekbones, and a narrow, pointed chin. The key to styling? Balance the top and bottom with side-swept bangs or chin-length layers for a beautifully harmonious effect.",
    src: "https://ext.same-assets.com/2922023174/1424132174.svg",
  },
  {
    name: "Diamond",
    desc:
      "Diamond face shapes are rare and striking, with high, dramatic cheekbones and a narrow forehead and jaw. The best look highlights the cheekbones while softening the edges—think volume at the chin or classic swept-back styles.",
    src: "https://ext.same-assets.com/2922023174/861616377.svg",
  },
];

/* FAQ items - shortened for brevity, add all later */
const faqs = [
  {
    q: "How does AI determine my face shape?",
    a: "Our face shape detector uses AI and facial landmark technology to measure your facial ratios and symmetry, matching your features to classic face shape categories like oval, square, or round. This ensures fast, accurate analysis using the latest advances in computer vision.",
  },
  {
    q: "Is my photo private and secure?",
    a: "Yes! For your privacy, photos never leave your browser—they’re analyzed instantly and not stored or shared anywhere. Only you control your image data.",
  },
  {
    q: "Why should I know my face shape?",
    a: "Understanding your face shape helps you choose hairstyles, glasses, and makeup that best suit your unique features. It’s a powerful tool for personal style, boosting your confidence and guiding beauty, grooming, and self-care decisions.",
  },
  {
    q: "Can this tool help with style or beauty choices?",
    a: "Absolutely. By revealing your face shape, our tool offers guidance for haircuts, beard styles, makeup contouring, and even selecting the perfect eyewear to complement your facial structure.",
  },
  {
    q: "Is this analysis free to use?",
    a: "Our face shape analysis tool is 100% free, with no registration or subscription required. Enjoy unlimited access for yourself and friends!",
  },
  {
    q: "How can I get the most accurate results?",
    a: "Upload a well-lit, front-facing photo with your hair pulled back and face fully visible. Avoid sunglasses, hats, or shadows for the most precise analysis.",
  },
  {
    q: "Can men and women both use this tool?",
    a: "Yes, our face shape detection works equally well for all genders and ages.",
  },
  {
    q: "What if my face shape is a mix of two types?",
    a: "Many people have combination features. Our AI compares your proportions to every category and shows a breakdown, so you see your closest overall match and your unique blend.",
  },
  {
    q: "How accurate is this AI compared to expert analysis?",
    a: "Our technology uses the same principles as professional stylists and makeup artists—leveraging landmark points and advanced ratios for reliable, repeatable results. For best accuracy, use a high-quality image.",
  },
  {
    q: "Is there a limit to how many photos I can analyze?",
    a: "Nope! Run as many analyses as you like—perfect for comparing multiple looks, seasons, or family members.",
  },
  {
    q: "Will my face shape change over time?",
    a: "While your bone structure doesn’t change much after adulthood, changes in weight, age, or hairstyle can affect how your face is perceived. You can always re-check your shape anytime!",
  },
];

const blogPreviews = [
  {
    title: "Which face shape do I have?",
    img: "https://ext.same-assets.com/2922023174/3690502606.png",
    desc: "A guide to determining your face shape with AI",
    href: "/blog/which-face-shape-do-i-have",
  },
  {
    title: "Which glasses for my face shape?",
    img: "https://ext.same-assets.com/2922023174/2626740518.png",
    desc: "Find the right glasses for your face shape",
    href: "/blog/which-glasses-for-my-face-shape",
  },
  {
    title: "Which hairstyle for my face shape?",
    img: "https://ext.same-assets.com/2922023174/3642289073.png",
    desc: "Find the right hairstyle for your face shape",
    href: "/blog/how-to-choose-the-perfect-hairstyle-for-your-face-shape",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fafafa] flex flex-col w-full">
      {/* Header/Nav */}
      <header className="w-full flex items-center justify-between bg-white shadow-sm px-6 py-3 sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <span className="font-bold text-xl text-[#453670]">Face Shape AI</span>
        </div>
        <nav className="hidden md:flex gap-8 text-[#453670] font-medium text-base">
          <a href="#detect_face_shape" className="hover:text-[#a656c2]">Detect Face Shape</a>
          <a href="#faq" className="hover:text-[#a656c2]">FAQ</a>
          <Link href="/blog" className="hover:text-[#a656c2]">Blog</Link>
        </nav>
      </header>
      {/* Hero/tool area */}
      <section id="detect_face_shape" className="w-full flex flex-col md:flex-row gap-8 py-12 px-4 md:px-16 bg-gradient-to-br from-[#fafafa] to-[#e1c4a7]/30 items-center">
        <div className="flex-1 max-w-md space-y-4">
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#453670]">Face Shape Detector</h1>
          <h2 className="text-lg text-[#9b999a]">Upload a photo of yourself and let the AI tell you what face shape you have.</h2>
          {/* Face shape detection tool placeholder */}
          <div className="mt-6 p-6 bg-white rounded-xl shadow flex flex-col gap-4">
            <FaceShapeTool />
          </div>
        </div>
        <div className="flex-1 flex justify-center items-center">
          <Image src="https://ext.same-assets.com/2922023174/960556571.png" width={360} height={360} alt="face analysis banner" className="rounded-xl shadow" />
        </div>
      </section>
      {/* Face shapes section */}
      <section className="py-12 px-4 md:px-16 bg-[#fafafe]">
        <h2 className="text-2xl md:text-3xl font-bold text-[#453670] mb-6">The six most common face shapes</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {faceShapes.map((shape) => (
            <div className="flex flex-col gap-2 items-center bg-white rounded-xl shadow p-6" key={shape.name}>
              <Image src={shape.src} width={70} height={70} alt={`${shape.name} face`} />
              <div className="text-lg font-semibold text-[#a656c2]">{shape.name}</div>
              <div className="text-[#6c6a74] text-center text-sm">{shape.desc}</div>
            </div>
          ))}
        </div>
      </section>
      {/* FAQ section */}
      <section id="faq" className="py-12 px-4 md:px-16 bg-white">
        <h2 className="text-2xl md:text-3xl font-bold text-[#453670] mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map(({ q, a }, i) => (
            <div key={i} className="bg-[#fafafa] rounded-lg p-4">
              <div className="font-semibold text-[#a656c2]">{q}</div>
              <div className="text-[#6c6a74] mt-1 text-sm">{a}</div>
            </div>
          ))}
        </div>
      </section>
      {/* Blog section */}
      <section className="py-12 px-4 md:px-16 bg-[#fafafe]">
        <h2 className="text-2xl md:text-3xl font-bold text-[#453670] mb-6">Blog</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {blogs.map((b) => (
            <article key={b.slug} className="bg-white rounded-xl shadow p-5 flex flex-col gap-2">
              <h3 className="text-lg font-semibold text-[#a656c2]">{b.title}</h3>
              <p className="text-[#6c6a74] text-sm">{b.blurb}</p>
              <Link className="self-start mt-2 px-3 py-1 bg-[#a656c2] text-white rounded hover:bg-[#453670] text-xs" href={`/blog/${b.slug}`}>Read More</Link>
            </article>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/blog" className="text-[#a656c2] hover:underline font-medium inline-block">View All Blog Posts</Link>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-[#453670] text-white py-8 px-4 md:px-16 mt-4">
        <div className="flex flex-col md:flex-row items-center md:justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-medium">Copyrights @2025 Face Shape AI</span>
          </div>
          <div className="flex gap-6 text-sm">
            <a href="/api" className="hover:underline">Face Shape AI API</a>
            <a href="/other-tools" className="hover:underline">Other tools</a>
            <a href="/blog" className="hover:underline">Blog</a>
            <a href="/data_privacy" className="hover:underline">Data privacy</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
