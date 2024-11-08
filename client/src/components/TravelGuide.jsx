import { useEffect, useState } from "react";
import axios from "axios";
import { Copy, CopyCheck } from "lucide-react";

export default function TravelGuide() {
  const [dataTrips, setDataTrips] = useState([]);
  const [search, setSearch] = useState("");
  const [alert, setAlerth] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = !search
          ? `http://localhost:4001/trips?keywords=`
          : `http://localhost:4001/trips?keywords=${search}`;
        const response = await axios.get(url);
        setDataTrips(response.data.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [search]);

  const limitText = (text, limit) => {
    return text.length > limit ? text.substring(0, limit) : text;
  };

  const handleTag = (tag) => {
    setSearch((prev) => prev + (!prev ? "" : " ") + tag);
  };

  const handleCopy = async (copyURL) => {
    try {
      await navigator.clipboard.writeText(copyURL);
      setAlerth(true);   
      setTimeout(() => {
        setAlerth(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };
  

  return (
    <div className="w-full flex flex-col justify-center items-center ">
      {/* search */}
      <div className="xl:w-3/5 w-4/5 flex flex-col gap-4">
        <h2 className="text-xl text-gray-500 font-medium">ค้นหาที่เที่ยว</h2>
        <input
          placeholder="หาที่เที่ยวแล้วไปกัน..."
          className="border w-full text-center py-2 font-medium text-lg outline-none"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
        />
      </div>
      {/* data */}
      <div className="w-3/4 py-6 flex flex-col gap-7">
        {dataTrips.map((data, index) => (
          <div key={index} className="flex gap-8 flex-col lg:flex-row justify-center items-center">
            <img
              src={data.photos[0]}
              alt={data.title}
              className="lg:w-1/4 w-full h-64 object-cover rounded-3xl"
            />
            <div className="lg:w-3/4 w-full h-full flex flex-col gap-5">
              <a href={data.url} target="_blank">
                <h1 className="lg:text-3xl text-2xl font-medium text-gray-600">{data.title}</h1>
              </a>
              <p className="text-gray-500 font-medium">
                {limitText(data.description, 100)} ...
                <a href={data.url} target="_blank">
                  <span className="text-[#3E99D3]"> อ่านต่อ</span>
                </a>
              </p>
              <div className="flex flex-col md:flex-row gap-3 text-gray-500 items-start md:items-center">
                หมวด
                <div className="flex flex-col md:gap-4 md:flex-row gap-1">
                {data.tags.map((tag, index) => (
                  <div key={index} className="flex gap-3 ">
                    <button 
                      onClick={() => handleTag(tag)}
                      className="underline"
                    >
                      {tag}
                    </button>
                    {index === data.tags.length - 2 && <span className="hidden md:block">และ</span>}
                  </div>
                ))}
                </div>
              </div>
              <div className="flex md:justify-between md:items-center flex-col md:flex-row gap-3">
                <div className="flex gap-4">
                  <img
                    src={data.photos[1]}
                    alt={data.title}
                    className="w-24 object-cover rounded-lg h-24"
                  />
                  <img
                    src={data.photos[2]}
                    alt={data.title}
                    className="w-24 object-cover rounded-lg h-24"
                  />
                  <img
                    src={data.photos[3]}
                    alt={data.title}
                    className="w-24 object-cover rounded-lg h-24"
                  />
                </div>
                <div
                  className="w-16 h-16 border border-[#389BD8] rounded-full flex items-center justify-center hover:scale-125 transition-transform duration-300 ease-in-out cursor-pointer"
                  onClick={() => handleCopy(data.url)}
                >
                  <Copy className="text-[#389BD8] w-8 h-8" />
                </div>
              </div>
              <hr className="border border-black lg:hidden flex"/>
            </div>
          </div>
        ))}
      </div>
      {/* Fixed bottom */}
      {alert ? <div className="bg-[#389BD8] rounded-xl fixed bottom-0 w-full h-[100px] flex flex-col items-center justify-center p-3">
        <CopyCheck className="text-white w-10 h-10"/>
        <p className="text-white text-xl">Copy URL To ClipBoard</p>
      </div> : null}
    </div>
  );
}

