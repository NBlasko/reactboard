import { useEffect, useState } from 'react'
import axios from 'axios'
import { SERVERURL } from '../../../store/types/types';
export default function useSearch({
  searchText,
  skip,
  criteria,
  setMessages
}) {

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [hasMore, setHasMore] = useState(false)

  useEffect(() => {
    const newCriteria = (criteria === "") ? "new" : criteria;
    setLoading(true);
    setError(false);
    let cancel;
    const params = { skip: skip, criteria: newCriteria }
    if (searchText) params.searchText = searchText;

    axios({
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.reactBoardToken}`,
        'Cache-Control': 'no-cache'
      },
      url: SERVERURL + 'api/blogs',
      params,
      cancelToken: new axios.CancelToken(c => cancel = c)
    })
      .then(res => {
        // console.log("res", res.data)
        setMessages(prevState => {
          return [...new Set([...prevState, ...res.data])]
        })
        setHasMore(res.data.length > 0)
        setLoading(false)
      }).catch(e => {
        console.log("error", e)
        if (axios.isCancel(e)) return
        
        setError(true)
      })
    return () => cancel()
  }, [skip, criteria, setMessages, searchText])
  return { loading, error, hasMore }
}