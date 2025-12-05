'use client'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 via-violet-50 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 text-gradient">欢迎来到学习乐园</h1>
          <p className="text-gray-600 dark:text-gray-300">请选择进入「字趣AI」或「数学小天才」</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <a href="/" className="group block bg-white dark:bg-gray-800 rounded-2xl shadow hover:shadow-lg transition p-6">
            <div className="flex items-center gap-4">
              <div className="text-4xl">🈶</div>
              <div>
                <div className="text-xl font-semibold mb-1">字趣 AI</div>
                <div className="text-gray-500 dark:text-gray-400 text-sm">智能化、可视化的汉字学习平台</div>
              </div>
            </div>
            <div className="mt-4 inline-flex items-center gap-2 text-indigo-600 group-hover:gap-3 transition">
              进入学习 <span>➜</span>
            </div>
          </a>

          <a href="/math" className="group block bg-white dark:bg-gray-800 rounded-2xl shadow hover:shadow-lg transition p-6">
            <div className="flex items-center gap-4">
              <div className="text-4xl">🔢</div>
              <div>
                <div className="text-xl font-semibold mb-1">数学小天才</div>
                <div className="text-gray-500 dark:text-gray-400 text-sm">趣味练习加减乘除、分数和小数</div>
              </div>
            </div>
            <div className="mt-4 inline-flex items-center gap-2 text-pink-600 group-hover:gap-3 transition">
              进入练习 <span>➜</span>
            </div>
          </a>
        </div>
      </div>
    </main>
  )
}
