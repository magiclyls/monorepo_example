const dictCache = new Map([
  ["currency", [
    { label: "巴西雷亚尔", value: "BRL" },
    { label: "越南盾", value: "VND" },
    { label: "人民币", value: "CNY" },
    { label: "美元", value: "USD" },
  ]],
  ["status", [
    { label: "开启", value: 1 },
    { label: "禁用", value: 0 },
  ]],
  ["playerStatus", [
    { label: "启用", value: 1 },
    { label: "关闭", value: 0 },
  ]],
  ["online", [
    { label: "在线", value: 1 },
    { label: "离线", value: 0 },
  ]],
  ["game", [
    { label: "Win Go 30 S", value: 1 },
    { label: "Win Go 1 Min", value: 2 },
  ]],
  ["accountChange", [
    { label: "转入", value: 1 },
    { label: "转出", value: 2 },
    { label: "游戏结算", value: 3 },
  ]],
  ["is_maintenance", [
    { label: "正常", value: 1 },
    { label: "维护", value: 0 },
  ]],
  ["game_status", [
    { label: "上线", value: 1 },
    { label: "下线", value: 0 },
  ]],
]);

/**
 * 网络请求Key
 */
export const dictNetworkMap = {
  /** 商户列表数据 */
  merchantList: 'merchantList'
}

// 正在请求的 key 对应的 Promise
const pendingRequests = new Map();

const fetchDictData = async (key) => {
  let arr=[
    {
      label: `网络请求 ${key}`,
      value: "sdfsdf"
    }
  ]
  return arr
}

/**
 * 获取字典数据
 * @param key 字典 key
 * @returns 字典数据（同步返回缓存 / 异步返回 Promise）
 */
export const getDict = async (key) => {
  // ✅ 已缓存，直接返回
  if (dictCache.has(key)) {
    return dictCache.get(key);
  }

  // ✅ 已有请求在发送中，直接返回相同的 Promise
  if (pendingRequests.has(key)) {
    console.log(key, '发送中')
    return pendingRequests.get(key);
  }

  // ❌ 没缓存、没请求，发起新请求
  const promise = (async () => {
    try {
      console.log('发送Dict网络请求', key)
      const res = await fetchDictData(key);
      dictCache.set(key, res); // 缓存结果
      return res;
    } catch (err) {
      console.error(`❌ 获取Dict ${key} 错误:`, err);
      return [];
    } finally {
      pendingRequests.delete(key); // 清理 pending
    }
  })();

  pendingRequests.set(key, promise); // 保存正在进行的请求
  return promise;
};

/**
 * 查找 Dict 数据 value 对应的 label
 * @param key
 * @param value
 * @returns {Promise<*>}
 */
export const getDictLabel = async (key, value) => {
  const list = await getDict(key);
  if (list) {
    const found = list.find((item) => item.value === value);
    return found ? found.label : undefined;
  }
  return undefined;
};
