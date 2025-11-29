import os
import json

# 路径变量
LANG_FILE = "./lang.json"
LOCALES_DIR = "./locales"


def printError(msg):
    print(f"\033[91m{msg}\033[0m")

# 检查 lang.json 文件是否存在
if not os.path.isfile(LANG_FILE):
    print(f"Error: {LANG_FILE} not found.")
    exit(1)

# 读取 lang.json 并删除空行
with open(LANG_FILE, "r", encoding="utf-8") as f:
    lines = [line.strip() for line in f.readlines() if line.strip()]

# 判断文件是否为空
if not lines:
    printError(f"文件 {LANG_FILE} 为空.")
    exit(1)

# 解析 JSON 数据
try:
    with open(LANG_FILE, "r", encoding="utf-8") as f:
        lang_data = json.load(f)
except json.JSONDecodeError:
    printError("错误: JSON 解析失败.")
    exit(1)

# 获取 locales 目录下所有的 .yml 文件
yml_files = [f.replace(".yml", "") for f in os.listdir(LOCALES_DIR) if f.endswith(".yml")]
yml_files = [f for f in yml_files if f != "aa-AA"]


# 打印获取到的 YAML 文件名（不含后缀）
print("YAML files:", yml_files)
langJsonKeys = lang_data.keys()
langMap={}
for key in langJsonKeys:
    langMap[key] = {}
    for yml in yml_files:
        if yml == 'zh-CN':
            langMap[key][yml] = lang_data[key]
        else:
            langMap[key][yml] = ""


os.system('sh ./scripts/clone_or_pull_lang.sh')

globalJsonData = {}
jsonDir = './locales/json/frontend/global.json'
if os.path.exists(jsonDir):
    with open(jsonDir, 'r', encoding='utf-8') as f:
        globalJsonData = json.load(f)

isKeyExist = False
# 将langMap的数据写入到globalJsonData中，如果key重复，跳过
for key in langMap:
    if key in globalJsonData:
        isKeyExist = True
        printError(f"错误：{key} 已经存在于 locales/json/frontend/global.json 中")
        continue
    globalJsonData[key] = langMap[key]

if isKeyExist:
  printError("已退出.")
  exit(1)

# 记录当前目录
currentDir = os.getcwd()

os.chdir('./locales/json')
os.system('git pull origin main')

os.chdir(currentDir)

# 写入到global.json文件
with open(jsonDir, 'w', encoding='utf-8') as f:
  json.dump(globalJsonData, f, ensure_ascii=False, indent=2)


with open(LANG_FILE, "w", encoding="utf-8") as f:
    f.write("")

# 提交到git
os.chdir('./locales/json')
os.system('git add .')
commitMsg = input("请输入commit信息：")
os.system(f'git commit -m "{commitMsg}"')
os.system('git push origin main')

os.chdir(currentDir)

os.system('pnpm updateLang')

print("完成.")
