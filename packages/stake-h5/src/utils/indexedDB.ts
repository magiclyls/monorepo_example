/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
export class IndexedDBHelper {
  constructor(dbName: string, version: number) {
    this.dbName = dbName
    this.version = version
    this.db = null
  }

  // 初始化数据库
  init(objectStores = []) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onupgradeneeded = (event) => {
        const db = event.target.result
        objectStores.forEach((store) => {
          if (!db.objectStoreNames.contains(store.name)) {
            const objectStore = db.createObjectStore(store.name, store.options)
            // 创建索引
            if (store.indexes) {
              store.indexes.forEach((index) => {
                objectStore.createIndex(index.name, index.keyPath, index.options)
              })
            }
          }
        })
      }

      request.onsuccess = (event) => {
        this.db = event.target.result
        resolve()
      }

      request.onerror = (event) => {
        reject(new Error(`数据库打开失败: ${event.target.error}`))
      }
    })
  }

  // 获取事务和对象存储
  getStore(storeName, mode = 'readonly') {
    const transaction = this.db.transaction([storeName], mode)
    return transaction.objectStore(storeName)
  }

  // 添加数据
  add(storeName, data) {
    return new Promise((resolve, reject) => {
      const store = this.getStore(storeName, 'readwrite')
      const request = store.add(data)

      request.onsuccess = () => resolve('添加成功')
      request.onerror = e => reject(new Error(`添加失败: ${e.target.error}`))
    })
  }

  // 更新数据
  update(storeName, data) {
    return new Promise((resolve, reject) => {
      const store = this.getStore(storeName, 'readwrite')
      const request = store.put(data)

      request.onsuccess = () => resolve('更新成功')
      request.onerror = e => reject(new Error(`更新失败: ${e.target.error}`))
    })
  }

  save(storeName, data) {
    return new Promise((resolve, reject) => {
      const store = this.getStore(storeName, 'readwrite')
      const getRequest = store.get(data[store.keyPath || 'id']) // 取主键名或默认 'id'

      getRequest.onsuccess = () => {
        const exists = getRequest.result !== undefined
        const request = exists ? store.put(data) : store.add(data)

        request.onsuccess = () => resolve(exists ? '更新成功' : '添加成功')
        request.onerror = e => reject(new Error(`保存失败: ${e.target.error}`))
      }

      getRequest.onerror = (e) => {
        reject(new Error(`获取失败: ${e.target.error}`))
      }
    })
  }

  // 删除数据
  delete(storeName, key) {
    return new Promise((resolve, reject) => {
      const store = this.getStore(storeName, 'readwrite')
      const request = store.delete(key)

      request.onsuccess = () => resolve('删除成功')
      request.onerror = e => reject(new Error(`删除失败: ${e.target.error}`))
    })
  }

  // 获取单个数据
  get(storeName, key) {
    return new Promise((resolve, reject) => {
      const store = this.getStore(storeName)
      const request = store.get(key)

      request.onsuccess = e => resolve(e.target.result)
      request.onerror = e => reject(new Error(`获取失败: ${e.target.error}`))
    })
  }

  // 获取全部数据
  getAll(storeName) {
    return new Promise((resolve, reject) => {
      const store = this.getStore(storeName)
      const request = store.getAll()

      request.onsuccess = e => resolve(e.target.result)
      request.onerror = e => reject(new Error(`获取全部数据失败: ${e.target.error}`))
    })
  }

  // 清空对象存储
  clear(storeName) {
    return new Promise((resolve, reject) => {
      const store = this.getStore(storeName, 'readwrite')
      const request = store.clear()

      request.onsuccess = () => resolve('清空成功')
      request.onerror = e => reject(new Error(`清空失败: ${e.target.error}`))
    })
  }

  // 删除数据库
  static deleteDB(dbName) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.deleteDatabase(dbName)

      request.onsuccess = () => resolve('数据库删除成功')
      request.onerror = e => reject(new Error(`删除失败: ${e.target.error}`))
      request.onblocked = () => reject(new Error('删除被阻止，可能有连接未关闭'))
    })
  }
}

// const dbHelper = new IndexedDBHelper('dadada', 1)
// IndexedDB 本身能避免重复创建 objectStore
// dbHelper.init([
//   {
//     name: 'users',
//     options: { keyPath: 'id', autoIncrement: true },
//     indexes: [
//       { name: 'domain', keyPath: 'domain', options: { unique: false } },
//     ],
//   },
// ]).then(() => {
//   console.log('swindexedDB初始化成功')
// }).catch(console.error)

// setTimeout(() => {
//   dbHelper.save('users', { id: 1, domain: 'https://www.google.com', time: 26 })
//   dbHelper.save('users', { id: 2, domain: 'https://a01.168pn.com/', time: 27 })
//     .then(console.log)
//     .catch(console.error)
// }, 1000)

// setTimeout(() => {
//   dbHelper.getAll('users')
//   .then(users => console.log('所有domains：', users))
//   .catch(console.error);
// }, 2000);

// setTimeout(() => {
//   dbHelper.clear('users')
//   .then(users => console.log('清除成功'))
//   .catch(console.error);
// }, 3000);

// setTimeout(() => {
//   dbHelper.getAll('users')
//   .then(users => console.log('所有domains：', users))
//   .catch(console.error);
// }, 4000);
