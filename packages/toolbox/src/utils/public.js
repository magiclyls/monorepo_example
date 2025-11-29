
export function flattenMenu(menu) {
  const result = [];

  function traverse(items) {
    items.forEach((item) => {
      // 把当前节点加入结果
      result.push({
        ...item,
        key: item.key,
        label: item.label,
        icon: item.icon,
      });

      // 如果有 children，递归处理
      if (item.children && Array.isArray(item.children)) {
        traverse(item.children);
      }
    });
  }

  traverse(menu);

  return result;
}

export function addKeyPath(items, parentPath = []) {
  return items.map(item => {
    const currentPath = [...parentPath, item.key];
    const newItem = {
      ...item,
      keyPath: currentPath.reverse(),
    };

    if (item.children) {
      newItem.children = addKeyPath(item.children, currentPath);
    }

    return newItem;
  });
}

export function setToken(token) {
  localStorage.setItem('token', token);
}

export function getToken() {
  return localStorage.getItem('token');
}

export function removeToken() {
  localStorage.removeItem('token');
}

export function buildTree(data, parentId = 0) {
  return data
    .filter(item => item.parent_id === parentId)
    .map(item => {
      const children = buildTree(data, item.id);
      return {
        title: item.permission_name, // TreeSelect 显示的文字
        value: item.id,              // TreeSelect 选中的值
        permission_code: item.permission_code,
        permission_name: item.permission_name,
        key: item.id,                // 唯一标识
        children: children.length > 0 ? children : undefined,
        raw: item                    // 保留原始数据（需要时可以用）
      };
    });
}

export function fuzzySearchTree(data, keyword) {
  const result = [];

  function dfs(node) {
    let matched = false;

    // 递归处理子节点
    let newChildren = [];
    if (node.children && node.children.length > 0) {
      newChildren = node.children
        .map(dfs) // 递归
        .filter(Boolean); // 去掉 null
      if (newChildren.length > 0) {
        matched = true; // 如果有匹配的子节点，也保留父节点
      }
    }

    // 判断当前节点是否匹配
    const isMatch =
      node.permission_name.includes(keyword) ||
      node.permission_code.includes(keyword);

    if (isMatch || matched) {
      // 返回新节点，保留原始数据
      return {
        ...node,
        children: newChildren.length > 0 ? newChildren : undefined,
      };
    }

    return null; // 不匹配则剔除
  }

  // 遍历所有根节点
  data.forEach((root) => {
    const res = dfs(root);
    if (res) result.push(res);
  });

  return result;
}