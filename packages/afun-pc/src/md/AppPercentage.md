# 体育
接口文件： src/apis/sport.ts
注意事项：体育接口的路由都在/sport/<平台id> 下，所以接口都是`/sport/${getSportsPlatId()}/event/list`这种格式

store: src/stores/sports.ts
数据起点：runSportsProvider({ game_type: 4 })
顺序：获取场馆 => 首页分类、盘口分类 侧边栏数据 => 计数数据(每个球种下有多少滚球、即将开赛赛事)
定时更新：
1：useSportsDataUpdate
2：/** 👷 分页、定时器、监听更新数据 start 👷 */ （不同地方更新频率和逻辑细节有一些不同，所以没有进行封装）

工具类：src/utils/sports.ts
1：购物车数据 SportsCart
2:盘口与购物车数据互通 addCartToListEvent


# 推广活动进度条需求
样式已完成，差后端和后台增加新的配置

# 体育风云榜数据明细弹窗
假数据直接展示，真数据需请求接口再进行展示；已对接完成，等测试测完和后端一起发。（后端修改了数据结构）

# Diamonds小游戏
UI和基本逻辑已完成，差下注接口，下注即开奖的模式，自动投注逻辑可参考Keno小游戏
