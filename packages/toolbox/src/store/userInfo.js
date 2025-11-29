import { create } from 'zustand'

const getPathName = (state) => {
  const name = location.pathname
  if (name === '/login') {
    return '/'
  }

  return name
}

export const useUserStore = create((set, get) => ({
  openKeys: [`/${getPathName().split('/')[1]}`],
  selectedKeys: [getPathName()],
  openMenus: [],

  setOpenKeys: (keys) => set({ openKeys: keys }),
  setSelectKeys: (keys) => set({ selectedKeys: keys }),
  addOpenMenus: (menus) => {
    const _openMenus = get().openMenus
    // 如果有相同的key，就不添加
    const newMenus = menus.filter(item => {
      return !_openMenus.find(menu => menu.key === item.key)
    })
    set({ openMenus: [..._openMenus, ...newMenus] })
  },
  removeOpenMenus: (key) => {
    const _openMenus = get().openMenus
    const index = _openMenus.findIndex(menu => menu.key === key)
    if (index > -1) {
      _openMenus.splice(index, 1)
      set({ openMenus: _openMenus })
    }
  },
  setOpenMenus: (menus) => set({ openMenus: menus }),
}))