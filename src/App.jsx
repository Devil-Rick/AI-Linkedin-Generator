import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clipboard,
  Images,
  ImageUp,
  Loader2,
  RefreshCw,
  Sparkles,
  Wand2
} from "lucide-react";

const defaultIdea =
  "AI is helping small teams create better LinkedIn content without hiring a full marketing team.";

function getApiMessage(error) {
  if (Array.isArray(error?.detail)) {
    return error.detail.map((item) => item.msg).join(" ");
  }

  return error?.detail || error?.message || "The backend could not generate a post.";
}

function getGeneratedPost(data) {
  const postMessage =
    data?.post_message ||
    data?.postMessage ||
    data?.["post message"] ||
    data?.["Post message"] ||
    data?.message ||
    data?.post ||
    data?.Post ||
    data?.generated_post ||
    data?.generatedPost ||
    data?.content ||
    data?.text;

  if (typeof postMessage === "string" && postMessage.trim()) {
    return postMessage;
  }

  return JSON.stringify(data, null, 2);
}

function ImageStack({ images, compact = false }) {
  const visibleImages = images.slice(0, compact ? 3 : 4);
  const remainingCount = Math.max(0, images.length - visibleImages.length);

  if (images.length === 0) {
    return null;
  }

  return (
    <div className={`image-stack ${compact ? "image-stack-compact" : ""}`}>
      {visibleImages.map((image, index) => (
        <img
          key={`${image.name}-${index}`}
          className="h-full min-w-0 flex-1 rounded-md border border-white/25 object-cover"
          src={image.src}
          alt={image.name}
        />
      ))}
      {remainingCount > 0 && (
        <div className="flex h-full min-w-[3.25rem] items-center justify-center rounded-md border border-white/25 bg-blue-950/70 text-sm font-bold text-white">
          +{remainingCount}
        </div>
      )}
    </div>
  );
}

function App() {
  const [idea, setIdea] = useState(defaultIdea);
  const [style, setStyle] = useState("Practical");
  const [audience, setAudience] = useState("Founders and small teams");
  const [images, setImages] = useState([]);
  const [post, setPost] = useState("");
  const [view, setView] = useState("input");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  const characterCount = idea.trim().length;
  const postLines = useMemo(() => post.split("\n").filter(Boolean).length, [post]);
  const primaryImage = images[0];
  const imageSummary =
    images.length === 0 ? `${characterCount} characters` : `${images.length} image${images.length > 1 ? "s" : ""} added`;

  function handleImageUpload(event) {
    const files = Array.from(event.target.files || []);

    if (files.length === 0) {
      return;
    }

    Promise.all(
      files.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve({ name: file.name, src: String(reader.result) });
            reader.readAsDataURL(file);
          })
      )
    ).then((uploadedImages) => {
      setImages((currentImages) => [...currentImages, ...uploadedImages]);
      event.target.value = "";
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsGenerating(true);
    setError("");

    try {
      const response = await fetch("/api/generate-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          learning_text: idea,
          style,
          audience
        })
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(getApiMessage(data));
      }

      setPost(getGeneratedPost(data));
      setIsGenerating(false);
      setView("output");
    } catch (requestError) {
      setError(requestError.message || "Unable to reach the backend.");
      setIsGenerating(false);
    }
  }

  function handleReset() {
    setIdea("");
    setStyle("Practical");
    setAudience("Founders and small teams");
    setImages([]);
    setPost("");
    setError("");
    setView("input");
  }

  return (
    <main className="app-shell bg-blue-950 text-white">
      <div className="app-bg" aria-hidden="true" />

      <div className="relative mx-auto flex h-full w-full max-w-6xl flex-col px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-white/15 pb-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-sm font-semibold text-blue-100">
              <Sparkles className="h-4 w-4 shrink-0 text-sky-300" aria-hidden="true" />
              <span>PostWave AI</span>
            </div>
            <h1 className="mt-1 truncate text-lg font-semibold tracking-normal text-white sm:text-2xl">
              Create a clean LinkedIn post from one idea.
            </h1>
          </div>

          <button
            className="inline-flex h-10 shrink-0 items-center gap-2 rounded-md border border-white/20 bg-white/10 px-3 text-sm font-semibold text-white transition hover:bg-white/15 focus:outline-none focus:ring-4 focus:ring-sky-300/25"
            type="button"
            onClick={handleReset}
            title="Reset"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </header>

        {view === "input" ? (
          <section className="grid min-h-0 flex-1 items-center gap-4 py-4 lg:grid-cols-[1fr_0.86fr]">
            <form
              className="flex min-h-0 flex-col rounded-lg border border-white/15 bg-white p-4 text-slate-950 shadow-2xl shadow-blue-950/35 sm:p-5"
              onSubmit={handleSubmit}
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-normal text-blue-600">Input</p>
                  <h2 className="text-xl font-semibold text-slate-950 sm:text-2xl">Post idea</h2>
                </div>
                <span className="rounded-md bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  Draft
                </span>
              </div>

              <label className="sr-only" htmlFor="idea">
                LinkedIn post idea
              </label>
                <div className="composer flex min-h-0 flex-1 flex-col rounded-lg border border-blue-200 bg-blue-50/70 p-3 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">
                <textarea
                  id="idea"
                  className="min-h-0 flex-1 resize-none bg-transparent text-base leading-6 text-slate-950 outline-none placeholder:text-slate-400"
                  value={idea}
                  onChange={(event) => setIdea(event.target.value)}
                  placeholder="Write the core thought, product update, insight, or lesson..."
                />

                <div className="mt-3 grid gap-3 border-t border-blue-200 pt-3 sm:grid-cols-2">
                  <label className="text-xs font-bold uppercase tracking-normal text-blue-700" htmlFor="style">
                    Style
                    <select
                      id="style"
                      className="mt-1 h-10 w-full rounded-md border border-blue-200 bg-white px-3 text-sm font-semibold normal-case text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      value={style}
                      onChange={(event) => setStyle(event.target.value)}
                    >
                      <option>Practical</option>
                      <option>Storytelling</option>
                      <option>Thought leadership</option>
                      <option>Conversational</option>
                    </select>
                  </label>

                  <label className="text-xs font-bold uppercase tracking-normal text-blue-700" htmlFor="audience">
                    Audience
                    <select
                      id="audience"
                      className="mt-1 h-10 w-full rounded-md border border-blue-200 bg-white px-3 text-sm font-semibold normal-case text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      value={audience}
                      onChange={(event) => setAudience(event.target.value)}
                    >
                      <option>Founders and small teams</option>
                      <option>Marketing leaders</option>
                      <option>Product builders</option>
                      <option>Career switchers</option>
                    </select>
                  </label>
                </div>

                {error && (
                  <p className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
                    {error}
                  </p>
                )}

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-blue-200 pt-3">
                  <div className="flex min-w-0 items-center gap-2 text-xs font-semibold text-blue-700">
                    {images.length > 0 && <Images className="h-4 w-4 shrink-0" aria-hidden="true" />}
                    <span className="truncate">{imageSummary}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <label
                      className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-md border border-blue-200 bg-white px-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
                      htmlFor="imageUpload"
                    >
                      <ImageUp className="h-4 w-4" aria-hidden="true" />
                      Images
                    </label>
                    <input
                      id="imageUpload"
                      className="sr-only"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                    />

                    <button
                      className="group inline-flex h-10 items-center gap-2 rounded-md bg-blue-600 px-4 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-blue-400"
                      type="submit"
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      ) : (
                        <Wand2 className="h-4 w-4" aria-hidden="true" />
                      )}
                      Post
                      {!isGenerating && (
                        <ArrowRight
                          className="h-4 w-4 transition group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  </div>
                </div>

                {images.length > 0 && (
                  <div className="mt-3 border-t border-blue-200 pt-3">
                    <ImageStack images={images} compact />
                  </div>
                )}
              </div>
            </form>

            <aside className="hidden min-h-0 rounded-lg border border-sky-300/20 bg-blue-900/45 p-5 shadow-2xl shadow-blue-950/30 backdrop-blur md:flex md:flex-col md:justify-between">
              <div>
                <p className="text-sm font-semibold text-sky-200">Image preview</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-normal text-white">
                  Upload one image or a compact visual set.
                </h2>
              </div>

              <div className="mt-5 overflow-hidden rounded-lg border border-white/15 bg-blue-950/40">
                <div className="preview-visual relative aspect-[1.55]">
                  {primaryImage && (
                    <img
                      className="absolute inset-0 h-full w-full object-cover"
                      src={primaryImage.src}
                      alt="Uploaded post reference"
                    />
                  )}
                  <ImageStack images={images} />
                </div>
              </div>
            </aside>
          </section>
        ) : (
          <section className="grid min-h-0 flex-1 gap-4 py-4 lg:grid-cols-[0.9fr_1.1fr]">
            <article className="relative hidden min-h-0 overflow-hidden rounded-lg border border-sky-300/25 bg-blue-900 shadow-2xl shadow-blue-950/35 lg:block">
              <div className="preview-visual h-full">
                {primaryImage && (
                  <img
                    className="absolute inset-0 h-full w-full object-cover"
                    src={primaryImage.src}
                    alt="LinkedIn post visual output"
                  />
                )}
                <ImageStack images={images} />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-blue-950/35 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                <div className="mb-2 inline-flex items-center gap-2 rounded-md bg-white/15 px-3 py-1 text-xs font-semibold text-blue-50 backdrop-blur">
                  <Check className="h-3.5 w-3.5 text-sky-200" aria-hidden="true" />
                  Image output
                </div>
                <h2 className="text-xl font-semibold tracking-normal text-white sm:text-2xl">
                  {images.length > 0 ? `${images.length} uploaded visual${images.length > 1 ? "s" : ""}` : "Blue editorial visual"}
                </h2>
              </div>
            </article>

            <article className="flex min-h-0 flex-col rounded-lg border border-white/15 bg-white p-4 text-slate-950 shadow-2xl shadow-blue-950/35 sm:p-5">
              <div className="mb-3 flex shrink-0 items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-normal text-blue-600">Output</p>
                  <h2 className="text-xl font-semibold text-slate-950 sm:text-2xl">Generated post</h2>
                </div>
                <span className="rounded-md bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  {postLines} lines
                </span>
              </div>

              <div className="preview-visual mb-3 h-24 shrink-0 rounded-lg border border-blue-100 lg:hidden">
                {primaryImage && (
                  <img
                    className="absolute inset-0 h-full w-full object-cover"
                    src={primaryImage.src}
                    alt="LinkedIn post visual output"
                  />
                )}
                <ImageStack images={images} compact />
              </div>

              <div className="output-copy min-h-0 flex-1 whitespace-pre-line rounded-lg border border-blue-100 bg-blue-50/80 p-4 text-sm leading-6 text-slate-800 sm:text-base">
                {post}
              </div>

              <div className="mt-3 flex shrink-0 flex-wrap items-center justify-between gap-2">
                <button
                  className="inline-flex h-10 items-center gap-2 rounded-md border border-blue-200 bg-white px-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
                  type="button"
                  onClick={() => setView("input")}
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  Update input
                </button>

                <button
                  className="inline-flex h-10 items-center gap-2 rounded-md bg-blue-600 px-4 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-200"
                  type="button"
                  onClick={() => navigator.clipboard?.writeText(post)}
                >
                  <Clipboard className="h-4 w-4" aria-hidden="true" />
                  Copy
                </button>
              </div>
            </article>
          </section>
        )}
      </div>
    </main>
  );
}

export default App;
