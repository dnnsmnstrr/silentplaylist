import React, { useState, useEffect, useContext } from 'react'
import useAuth from './useAuth'
import SpotifyWebAPI from 'spotify-web-api-js'

export const SpotifyContext = React.createContext({})

export const SpotifyProvider = ({ children }) => {
  const { token } = useAuth()
  const sp = new SpotifyWebAPI()
  const [playlistId, setPlaylistId] = useState()
  const [playlists, setPlaylists] = useState([])

  useEffect(() => {
    if (token) {
      sp.setAccessToken(token)
      getPlaylists()
    }
  }, [token])

  const getPlaylists = async () => {
    const { id: userId } = await sp.getMe()
    const { items: playlists } = await sp.getUserPlaylists(userId, { limit: 50 })
    setPlaylists(playlists.filter(({collaborative}) => collaborative))
  }

  const [selectedPlaylist, setSelectedPlaylist] = useState()
  useEffect(() => {
    if (selectedPlaylist && selectedPlaylist.uri) {
      const id = selectedPlaylist.uri.split(':').pop()
      setPlaylistId(id)
    }
  }, [selectedPlaylist])

  const [songs, setSongs] = useState([])

  const getSongs = async () => {
    const { items } = await sp.getPlaylistTracks(playlistId)
    setSongs(items)
    return items
  }

  useEffect(() => {
    if (playlistId) {
      getSongs()
    }
  }, [playlistId])

  const searchSongs = async (query) => {
    const { tracks: {items} } = await sp.searchTracks(query)
    return items
  }

  const playSong = async (position, uri) => {
    const options = uri ? {uris: [uri]} : {context_uri: selectedPlaylist.uri, offset: {position}}
    const res = await sp.play(options)
    return res
  }

  const addToPlaylist = async (uri) => {
    const res = await sp.addTracksToPlaylist(playlistId, [uri])
    return res
  }

  return (
    <SpotifyContext.Provider value={{ playlists, getPlaylists, setSelectedPlaylist, playlistId, setPlaylistId, songs, getSongs, searchSongs, playSong, addToPlaylist}}>
      {children}
    </SpotifyContext.Provider>
  )
}

export default () => useContext(SpotifyContext)
