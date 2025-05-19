export default function ButtonDraw ({ onClick }) {
  return (
    <div className="flex justify-center pb-8 pt-10">
      <button
        id="drawButton"
        className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-red-900 text-xl px-10 py-8 h-auto rounded-full font-bold shadow-[0_0_20px_rgba(255,204,0,0.5)] transition-all duration-200 active:scale-95 hover:scale-105 disabled:opacity-70 flex items-center"
        onClick= {onClick}
      >
        <svg id="spinner" className="hidden animate-spin mr-2 h-5 w-5 text-red-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
        <span id="buttonText">Quay Ngay!</span>
        <svg id="sparkleIcon" className="ml-2 h-6 w-6 text-red-900" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l1.09 3.41L16 6l-2.91 1.09L12 10l-1.09-2.91L8 6l2.91-1.09L12 2zm0 20l-1.09-3.41L8 18l2.91-1.09L12 14l1.09 2.91L16 18l-2.91 1.09L12 22zm10-10l-3.41 1.09L18 16l1.09-2.91L22 12l-2.91-1.09L18 8l-1.09 2.91L14 12l3.41-1.09L18 12zm-20 0l3.41-1.09L6 8l-1.09 2.91L2 12l2.91 1.09L6 16l1.09-2.91L10 12 6.59 13.09 6 12z"/>
        </svg>
      </button>
    </div>
  )
}