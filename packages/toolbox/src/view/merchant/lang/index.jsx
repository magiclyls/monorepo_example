import Init from './components/init'
import {getLangExist} from "@/services/api.js";
import {useEffect, useState} from "react";
import LangTable from "@/components/LnagTable/index.jsx";
import Synchronous from '@/components/LnagTable/synchronous.jsx'

const Lang = () => {
  const [isExistGit, setIsExistGit] = useState(false)
  async function init() {
    const [res, err] = await getLangExist()
    setIsExistGit(res?.exist || false)
  }

  useEffect(() => {
    init()
  }, [])
  return <div>
    {
      <Synchronous />
      // isExistGit ? <LangTable /> : <Init onSuccess={() => setIsExistGit(true)} />
    }
  </div>
}

export default Lang
