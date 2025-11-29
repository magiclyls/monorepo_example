import { Button, message } from 'antd'
import {useState} from "react";
import {initGit} from "@/services/api.js";

const Init = ( { onSuccess } ) => {
  const [loading, setLoading] = useState(false)
  const [messageApi, contextHolder] = message.useMessage();

  async function init() {
    setLoading(true)
    const [res, err] = await initGit()
    console.log("🚀 ~ init ~ err: ", err);
    console.log("🚀 ~ init ~ res: ", res);
    if (!err) {
      console.log("🚀 ~ init ~ res: ", res);
      messageApi.success("初始化成功")
      onSuccess && onSuccess()
    } else {
      messageApi.error(err)
    }
    setLoading(false)
  }
  return <div>
    {contextHolder}
    <Button size="large" type="primary" onClick={() => init()} loading={loading}>
      开始初始化
    </Button>
  </div>
}

export default Init
