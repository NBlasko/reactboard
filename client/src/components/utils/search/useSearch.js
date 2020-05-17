import { useEffect, useState } from 'react'
import axios from 'axios'
import { SERVERURL } from '../../../store/types/types';
export default function useSearch({query, skip, criteria, setMessages}) {

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [hasMore, setHasMore] = useState(false)

  useEffect(() => {
    const newCriteria = (criteria === "") ? "new" : criteria;
    setLoading(true)
    setError(false)
    let cancel
    axios({
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.reactBoardToken}`,
        'Cache-Control': 'no-cache'
      },
      url: SERVERURL + 'api/blogs',
      params: { /*q: query,*/ skip: skip, criteria: newCriteria },
      cancelToken: new axios.CancelToken(c => cancel = c)
    }).then(res => {
     // console.log("res", res.data)
      setMessages(prevState => {
        return [...new Set([...prevState, ...res.data])]
      })
      setHasMore(res.data.length > 0)
      setLoading(false)
    }).catch(e => {
      if (axios.isCancel(e)) return
      setError(true)
    })
    return () => cancel()
  }, [skip, criteria, setMessages])

  return { loading, error, hasMore }
}