import { NextRequest, NextResponse } from 'next/server'
import { getDb, type CharacterDocument } from '@/lib/db'
import { generateCharacterContent, getPinyin } from '@/lib/ai'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const char = searchParams.get('char')

    if (!char || char.trim() === '') {
      return NextResponse.json(
        { error: '请提供汉字参数' },
        { status: 400 }
      )
    }

    // 只取第一个字符
    const targetChar = char.trim()[0]

    // 验证是否为汉字
    if (!/[\u4e00-\u9fa5]/.test(targetChar)) {
      return NextResponse.json(
        { error: '请输入有效的汉字' },
        { status: 400 }
      )
    }

    // 测试数据库连接
    let db
    try {
      db = await getDb()
      // 测试连接
      await db.admin().ping()
    } catch (dbError: any) {
      console.error('MongoDB连接错误:', dbError)
      // 如果数据库连接失败，仍然尝试使用AI生成内容（不保存到数据库）
      console.warn('数据库连接失败，将仅使用AI生成内容（不保存到数据库）')
    }
    
    const collection = db ? db.collection<CharacterDocument>('characters') : null

    // 1. 先查询缓存（如果数据库可用）
    let characterData = null
    if (collection) {
      try {
        characterData = await collection.findOne({ char: targetChar })
        if (characterData) {
          // 命中缓存，更新访问计数
          await collection.updateOne(
            { char: targetChar },
            { $inc: { visit_count: 1 } }
          )
          
          // 返回缓存数据
          return NextResponse.json({
            char: characterData.char,
            pinyin: characterData.pinyin,
            radicals: characterData.radicals,
            stroke_count: characterData.stroke_count,
            ai_content: characterData.ai_content,
            visit_count: (characterData.visit_count || 0) + 1,
          })
        }
      } catch (queryError: any) {
        console.error('数据库查询错误:', queryError)
        // 继续执行，使用AI生成
      }
    }

    // 2. 缓存未命中，调用AI生成
    const [aiContent, pinyinValue] = await Promise.all([
      generateCharacterContent(targetChar),
      Promise.resolve(getPinyin(targetChar)),
    ])

    // 3. 构建新文档
    const newCharacter: CharacterDocument = {
      char: targetChar,
      pinyin: pinyinValue || '',
      ai_content: aiContent,
      created_at: new Date(),
      visit_count: 1,
    }

    // 4. 保存到数据库（如果数据库可用）
    if (collection) {
      try {
        await collection.insertOne(newCharacter)
      } catch (insertError: any) {
        console.error('数据库保存错误:', insertError)
        // 即使保存失败，也返回数据给用户
      }
    }

    // 5. 返回数据
    return NextResponse.json({
      char: newCharacter.char,
      pinyin: newCharacter.pinyin,
      radicals: newCharacter.radicals,
      stroke_count: newCharacter.stroke_count,
      ai_content: newCharacter.ai_content,
      visit_count: newCharacter.visit_count,
    })
  } catch (error: any) {
    console.error('API错误:', error)
    
    // 如果是数据库连接错误，提供更友好的错误信息
    if (error.message && (error.message.includes('Authentication failed') || error.message.includes('MongoDB连接错误'))) {
      return NextResponse.json(
        { 
          error: '数据库连接失败，但AI功能仍可使用',
          message: '即使数据库连接失败，应用仍可正常使用AI生成内容，只是不会保存缓存。请检查MongoDB配置或查看TROUBLESHOOTING.md获取帮助。'
        },
        { status: 200 } // 返回200，因为功能仍可用
      )
    }
    
    return NextResponse.json(
      { 
        error: error.message || '服务器内部错误',
        message: '如果这是数据库连接问题，应用仍可使用AI功能'
      },
      { status: 500 }
    )
  }
}

