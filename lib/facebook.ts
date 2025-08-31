import fetch from 'node-fetch'

export async function fetchFacebookVideos(pageId: string, accessToken: string, version = 'v19.0') {
  if (!accessToken) throw new Error('FB access token required')
  const url = `https://graph.facebook.com/${version}/${pageId}/videos?access_token=${accessToken}`
  const res = await fetch(url)
  return res.json()
}
