export default function Landing() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 via-violet-50 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* 顶部品牌区 */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/60 dark:bg-gray-800/60 shadow">
            <span className="text-2xl">🎓</span>
            <span className="font-semibold text-gray-700 dark:text-gray-200">学习乐园</span>
          </div>
          <h1 className="mt-4 text-4xl md:text-5xl font-extrabold text-gradient">选择你的学习之旅</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">进入「字趣AI」或「数学小天才」，开始有趣的学习体验</p>
        </div>

        {/* 导航卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 字趣AI */}
          <a href="/hanzi" className="group relative block overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg hover:shadow-2xl transition">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_20%,#ffffff,transparent_40%)]" />
            <div className="p-8">
              <div className="flex items-center gap-4">
                <div className="text-5xl">🈶</div>
                <div>
                  <div className="text-2xl font-bold">字趣 AI</div>
                  <div className="text-sm opacity-90">智能化、可视化的汉字学习平台</div>
                </div>
              </div>
              <div className="mt-6 bg-white/20 rounded-2xl p-4">
                <ul className="text-sm space-y-1">
                  <li>• AI 趣味讲解</li>
                  <li>• 笔顺动画演示</li>
                  <li>• 适合儿童的互动学习</li>
                </ul>
              </div>
              <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-indigo-700 font-semibold group-hover:gap-3 transition">
                进入学习 <span>➜</span>
              </div>
            </div>
          </a>

          {/* 数学小天才 */}
          <a href="/math" className="group relative block overflow-hidden rounded-3xl bg-gradient-to-br from-pink-500 to-orange-500 text-white shadow-lg hover:shadow-2xl transition">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_80%_20%,#ffffff,transparent_40%)]" />
            <div className="p-8">
              <div className="flex items-center gap-4">
                <div className="text-5xl">🔢</div>
                <div>
                  <div className="text-2xl font-bold">数学小天才</div>
                  <div className="text-sm opacity-90">趣味练习加减乘除、分数和小数</div>
                </div>
              </div>
              <div className="mt-6 bg-white/20 rounded-2xl p-4">
                <ul className="text-sm space-y-1">
                  <li>• 即时正确/错误反馈</li>
                  <li>• 三档难度可选</li>
                  <li>• 适合触屏设备的大按钮</li>
                </ul>
              </div>
              <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-pink-700 font-semibold group-hover:gap-3 transition">
                进入练习 <span>➜</span>
              </div>
            </div>
          </a>
        </div>

        {/* 额外说明 */}
        <div className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400">
          提示：你随时可以从顶部返回学习乐园选择其它模块。
        </div>
      </div>
    </main>
  )
}
