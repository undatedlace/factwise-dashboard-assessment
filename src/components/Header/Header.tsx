const Header = () => {

    return (
        <header className="bg-white border-b border-gray-200 px-6 py-3.5 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">F</span>
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-800 leading-none">FactWise</h1>
            <p className="text-xs text-gray-400 leading-none mt-0.5">People Analytics</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <span className="w-2 h-2 bg-green-400 rounded-full" />
          {new Date().toLocaleDateString('en-US', {
            weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
          })}
        </div>
      </header>
    )
}

export default Header