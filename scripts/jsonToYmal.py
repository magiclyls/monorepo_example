import json
import yaml
import os

jsonDir = 'packages/ph-h5/locales/json/queen/global.json'

# 打印当前路径拼接jsonDir的路径
print("999")
print(os.path.join(os.getcwd(), jsonDir))

def generate_yml_files(json_data, output_dir=os.path.join(os.getcwd(), 'packages/ph-h5/locales')):
  import os
  os.makedirs(output_dir, exist_ok=True)

  # 获取所有可能的 key
  all_keys = set()
  for translations in json_data.values():
    all_keys.update(translations.keys())

  # 按语言分类数据
  language_data = {lang: {} for lang in all_keys}
  for key, translations in json_data.items():
    for lang, value in translations.items():
      language_data[lang][key] = value

  # 生成 YML 文件
  for lang, translations in language_data.items():
    file_path = os.path.join(output_dir, f"{lang}.yml")
    with open(file_path, "w", encoding="utf-8") as file:
      yaml.dump(translations, file, allow_unicode=True, default_flow_style=False)

  print(f"YML 文件生成在 {os.path.abspath(output_dir)} 目录下.")

def getJsonData():
  with open(jsonDir, 'r', encoding='utf-8') as f:
    data = json.load(f)
  return data

# 生成 YML 文件
generate_yml_files(getJsonData())
