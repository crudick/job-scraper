
export async function searchJobs(search) {
  if(search.source=='L') {

      const response = await fetch(`/api/linkedin?keywords=${search.keywords}&location=${search.location}&page=${search.page}`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
      })
      return await response.json();
  } else if(search.source == 'I'){
    const response = await fetch(`/api/indeed?keywords=${search.keywords}&location=${search.location}&offset=${search.offset}`, {
      method: 'GET',
      headers: {'Content-Type': 'application/json'}
    })
    return await response.json();
  } else if(search.source == 'M'){
    const response = await fetch(`/api/monster?keywords=${search.keywords}&location=${search.location}&offset=${search.page}`, {
      method: 'GET',
      headers: {'Content-Type': 'application/json'}
    })
    return await response.json();
  }
}

export async function getJobDetails(id, source) {
  if(source=='L') {
    const response = await fetch(`/api/linkedin/job/${id}`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
      })
    return await response.json();
  } else if(source == 'I'){
    const response = await fetch(`/api/indeed/job/${id}`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
      })
    return await response.json();
  } else if(source == 'M'){
    const response = await fetch(`/api/monster/job/${id}`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
      })
    return await response.json();
  }
}