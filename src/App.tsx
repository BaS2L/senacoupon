import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useState } from 'react'

interface FormData {
  userId: string
}

export const codeList = [
  'BRANZEBRANSEL',
  'HALFGOODHALFEVIL',
  'LETSGO7K',
  'GRACEOFCHAOS',
  '100MILLIONHEARTS',
  '7S7E7V7E7N7',
  'POOKIFIVEKINDS',
  'GOLDENKINGPEPE',
  '77EVENT77',
  'HAPPYNEWYEAR2026',
  'KEYKEYKEY',
  'SENAHAJASENA',
  'SENA77MEMORY',
  'senastarcrystal',
  'Chaosessence',
  'oblivion',
  'TARGETWISH',
  'DELLONSVSKRIS',
  'DANCINGPOOKI',
]

export function App() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [results, setResults] = useState<Array<{ code: string; success: boolean; message: string }>>([])

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    setResults([])
    
    const requestResults: Array<{ code: string; success: boolean; message: string }> = []

    for (const code of codeList) {
      try {
        const response = await axios.get('https://coupon.netmarble.com/api/coupon/reward', {
          params: {
            gameCode: 'tskgb',
            couponCode: code,
            langCd: 'KO_KR',
            pid: data.userId,
          },
        })
        
        requestResults.push({
          code,
          success: true,
          message: response.data?.message || '성공',
        })
      } catch (error: any) {
        requestResults.push({
          code,
          success: false,
          message: error.response?.data?.errorMessage || error.message || '요청 실패',
        })
      }
    }

    setResults(requestResults)
    setIsSubmitting(false)
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setValue('userId', text, { shouldValidate: true })
    } catch (err) {
      console.error('클립보드 읽기 실패:', err)
      alert('클립보드를 읽을 수 없습니다.')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">유저 아이디 입력</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-2">
              유저 아이디
            </label>
            <input
              type="text"
              id="userId"
              {...register('userId', {
                required: '유저 아이디를 입력해주세요',
                minLength: {
                  value: 2,
                  message: '유저 아이디는 최소 2자 이상이어야 합니다',
                },
              })}
              placeholder="유저 아이디를 입력하세요"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.userId ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.userId && (
              <p className="mt-1 text-sm text-red-500">{errors.userId.message}</p>
            )}
            <button
              type="button"
              onClick={handlePaste}
              className="mt-2 w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors text-sm"
            >
              클립보드에서 붙여넣기
            </button>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '처리 중...' : '제출'}
          </button>
        </form>
        {results.length > 0 && (
          <div className="mt-6 max-h-96 overflow-y-auto">
            <h2 className="text-lg font-semibold mb-3 text-gray-800">처리 결과</h2>
            <div className="space-y-2">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-md text-sm ${
                    result.success
                      ? 'bg-green-50 text-green-800 border border-green-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  <div className="font-medium">{result.code}</div>
                  <div className="text-xs mt-1">{result.message}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
