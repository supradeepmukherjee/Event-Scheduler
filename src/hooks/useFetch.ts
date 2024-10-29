import { useState } from "react"

const useFetch = (f: (...args: any[]) => Promise<{ success: boolean; }>) => {
    const [data, setData] = useState({})
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<Error|null>(null)
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