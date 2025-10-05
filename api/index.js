import { search as neteaseSearch, song as neteaseSong, lyric as neteaseLyric } from './netease.js';
import { search as tencentSearch, song as tencentSong, lyric as tencentLyric } from './tencent.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { server = 'netease', type = 'search', id, s } = req.query;

  try {
    let result;
    if (server === 'netease') {
      if (type === 'search') result = await neteaseSearch(s);
      else if (type === 'song') result = await neteaseSong(id);
      else if (type === 'lyric') result = await neteaseLyric(id);
    } else if (server === 'tencent') {
      if (type === 'search') result = await tencentSearch(s);
      else if (type === 'song') result = await tencentSong(id);
      else if (type === 'lyric') result = await tencentLyric(id);
    } else {
      return res.status(400).json({ error: 'Unsupported server' });
    }

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
