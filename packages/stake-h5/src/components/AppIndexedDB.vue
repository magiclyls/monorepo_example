<script setup lang='ts'>
defineOptions({
  name: 'AppIndexedDBHelper',
})
onMounted(() => {
  setTimeout(() => {
    const dbHelper = new IndexedDBHelper('dadada', 1)
    dbHelper.init([
      {
        name: 'users',
        options: { keyPath: 'id', autoIncrement: true },
        indexes: [
          { name: 'domain', keyPath: 'domain', options: { unique: false } },
        ],
      },
    ]).then(() => console.log('%c主程序indexedDB初始化成功', 'color: #62c554'))
      .catch(() => console.log('%c主程序indexedDB初始化失败', 'color: #e10d8a'))

    setTimeout(() => {
      const domains = (globalInitMap?.allBrandInfo?.api_domain?.pwa_back_domain || []).join()
      const newItem = { id: 1, domain: domains, time: Date.now() }
      dbHelper.save('users', newItem)
      window.parent.postMessage({ type: 'UPTDAE_DOMAINS', data: newItem }, '*')
    }, 1000)
  }, 1000 * 5)
})
</script>
