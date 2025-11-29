---

# https://vitepress.dev/reference/default-theme-home-page

layout: home

hero:
name: "TG"
text: "组件库"

---

# 欢迎来到文档

点击按钮开始查看组件

<div class="divWrap">
    <a href="/BaseButton" class="custom-button">跳转到快速查看文档</a>
</div>

<style>
.divWrap{
    display: flex;
    justify-content: space-around;
    align-items: center;
}
.custom-button {
    display: inline-block;
    padding: 10px 20px;
    background-color: #42b983;
    color: white;
    text-decoration: none;
    border-radius: 5px;
    transition: background-color 0.3s;
    color:#fff !important;

}
.custom-button:hover {
    background-color: #33a06f;
}
</style>
