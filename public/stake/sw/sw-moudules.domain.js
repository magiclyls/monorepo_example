// 获取域名列表
async function fetchDomainList() {
    try {
      let list =  await dbHelper.getAll('users')
      list = list[0].domain.split(',')
      console.log('所有domains：', list);
      if (list.length) {
        return list.map(item => {
         const url =  item.trim()
          return url.endsWith('/') ? url.slice(0, -1) : url
        })
      }
      return [];
    } catch (err) {
      console.log('get domain fail',err);
      return [];
    }
  }
  
  async function checkDomainAvailability(domain) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(domain);  // 加载成功
      img.onerror = () => resolve(false); // 加载失败
      img.src = `${domain}/webp/affiliate/medal.webp?${Date.now()}`; // 加个时间戳防缓存
    });
  }
  
  // 查找可用域名
  async function findAvailableDomain(availableDomains) {
    for (const domain of availableDomains) {
      if (await checkDomainAvailability(domain)) {
        return domain;
      }
    }
    return false;
  }
  
  
  const buildStringMap = () => {
    return {
      checkDomainAvailability,
      findAvailableDomain,
      fetchDomainList,
      IndexedDBHelper,
    };
  }
  