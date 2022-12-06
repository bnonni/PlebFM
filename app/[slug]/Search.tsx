import React, { useEffect, useState } from "react"
import NavBar from "../../components/NavBar"
import plebFMLogo from "../../public/plebfm-logo.svg"
import bokeh2 from "../../public/pfm-bokeh-2.jpg"
import Image from "next/image"
import {webpack} from "next/dist/compiled/webpack/webpack";
import javascript = webpack.javascript;
import { usePathname } from "next/navigation"

const fetchSong = async (query: string, shortName: string): Promise<{name: string, artists:{name: string}[]}[]> => {
  if (query === "") return [];
  const queryString = new URLSearchParams({ query: query, shortName: shortName, limit: "10" });
  const res = await fetch(`/api/spotify/search?${queryString}`, {
    headers: { 'Access-Control-Allow-Origin': '*' }
  });
  if (!res.ok) throw new Error('Failed to search song');
  return (await res.json()).items;
}

interface SearchProps {
  parentCallback: javascript
}

export default function Search(props: SearchProps){
  const [searchTerm, setSearchTerm] = React.useState('')
  const [searchResult, setSearchResult] = useState<{name: string, artists:{name: string}[]}[]>([]);
  const [loading, setLoading] = useState(true);
  const name = usePathname()?.replaceAll('/', "") || "";

  useEffect(() => {
    if (!searchTerm || !name) {
      setSearchResult([]);
      return;
    }
    const search = setTimeout(async () => {
      setLoading(true);
      const results = await fetchSong(searchTerm.trim(), name) ?? [];
      console.log(JSON.stringify(results[0]));
      setSearchResult(results);
      setLoading(false);
    }, 300);

    return () => clearTimeout(search);
  }, [searchTerm, name])

  const selectSong = (e: React.ChangeEvent<any>)=>{
    props.parentCallback(e.target.dataset.songId)
  }

  return(
    <>
      <div className="fixed w-full h-full bg-black top-0 left-0 bg-pfm-purple-100">
        <Image src={bokeh2} alt="" width="100" className="object-cover w-full h-full blur-2xl opacity-50" />
      </div>

      <div className="py-12 pb-36 text-white relative z-50 flex flex-col items-center min-h-screen font-thin">
        <div className="px-6 py-12 space-y-6 flex flex-col fixed top-0 left-0 z-[99]">
          <Image src={plebFMLogo} alt="PlebFM" className="w-3/5 mx-auto" />

          <div className="text-left space-y-2">
            <label className="uppercase font-bold text-left tracking-widest text-xs">Search for a Song</label>
            <input
              autoFocus
              type="text"
              placeholder="Bitcoin killed the fiat star..."
              className="w-full p-4 text-lg bg-white/10 placeholder:text-pfm-neutral-800 text-pfm-orange-800 outline outline-2 outline-white focus:outline-pfm-orange-800"
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
            />
          </div>

          {searchTerm.length < 1 ?
            <div className="w-full flex flex-col justify-center items-center">
              <svg width="29" height="168" viewBox="0 0 29 168" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.2381 165.65C16.0115 166.447 16.4738 167.276 17.2706 167.503C18.0675 167.73 18.8971 167.267 19.1237 166.47L16.2381 165.65ZM8.24429 0.97334C7.49779 0.614144 6.60144 0.928121 6.24225 1.67463L0.388819 13.8396C0.0296247 14.5861 0.343603 15.4825 1.09011 15.8417C1.83661 16.2009 2.73296 15.8869 3.09215 15.1404L8.2952 4.32706L19.1085 9.5301C19.855 9.8893 20.7514 9.57532 21.1106 8.82881C21.4698 8.08231 21.1558 7.18596 20.4093 6.82677L8.24429 0.97334ZM19.1237 166.47C31.5318 122.832 33.5125 71.7806 9.00957 1.82912L6.17825 2.82089C30.4875 72.2194 28.4682 122.638 16.2381 165.65L19.1237 166.47Z" fill="white"/>
              </svg>
              <p className="text-xl font-medium">Type in a song name</p>
            </div>
          : ``}
        </div>

        {searchResult.length > 0?
          <div className="absolute top-0 left-0 h-full pt-56 pb-32 overflow-hidden z-[98]">
            <div className="h-full overflow-y-scroll">
              {searchResult.map((track, key)=>(
                <div className="px-7 py-4 border-b border-b-1 border-white/20" key={key} onClick={selectSong} data-song-id="aaaa-bbbb-cccc-ddd">
                  <p className="pointer-events-none">{track.name}</p>
                  <p className="font-bold text-[12px] pointer-events-none">{track.artists[0].name}</p>
                </div>
              ))}
            </div>
          </div>
        : ``}

        <NavBar activeBtn="search" />
      </div>
    </>
  )
}