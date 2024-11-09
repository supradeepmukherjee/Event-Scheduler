import { useState } from "react"

const useFetch = <T = any>(f: (...args: any[]) => Promise<T>) => {
    const [data, setData] = useState<T | {}>({})
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)
    const fn = async (...args: any[]) => {
        setLoading(true)
        setError(null)
        try {
            const res = await f(...args)
            setData(res)
            setError(null)
        } catch (err: any) {
            setError(err)
        } finally {
            setLoading(false)
        }
    }
    return { data, loading, error, fn }
}

export default useFetch