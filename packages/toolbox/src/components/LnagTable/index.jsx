import { useEffect, useRef, useState } from 'react'
import css from './index.module.css'
import {
  getGitList,
  getGitData,
  getGitPull,
  updateLang,
  addLang as addLangApi,
  updateAllLang,
  getUpdateLocalFile,
} from "@/services/api.js";
import { Select, Button, Tabs } from 'antd'
import { message } from '@/utils'

export function joinClass(...arr) {
	return arr.join(' ')
}

export const langKeys = [
	'zh-CN', // 中文
	'en-US', // 英文
	'tl-PH', // 葡萄牙语
]

function getJsonKeyValues(json, key) {
  const res = {}
  for (const k in json) {
      res[k] = json[k][key] || '----'
  }
  console.log("🚀 ~ getJsonKeyValues ~ res: ", res, Object.keys(res).length);

  return res
}

async function transCopyTextTo2Array(value) {
	const res = value || (await navigator.clipboard.readText())
	const lines = res.split('\n') // 粗略分割出“行”
	const rows = []

	let currentRow = ''
	let expectedColCount = null

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i]
		// 尝试拼接当前行
		if (currentRow) {
			currentRow += `\n${line}`
		}
		else {
			currentRow = line
		}

		const cols = currentRow.split('\t')

		if (expectedColCount === null && cols.length >= 3) {
			// 第一次记录预期列数（防止误判）
			expectedColCount = cols.length
		}

		if (cols.length === expectedColCount) {
			// 正常行，推入结果
			rows.push(cols)
			currentRow = ''
		}
		else {
			// 列数不够，说明单元格内可能有换行，继续拼接下一行
			continue
		}
	}

	// 最后一行可能没推进去
	if (currentRow) {
		rows.push(currentRow.split('\t'))
	}

	console.log('📋 二维数组：', rows)
	return rows
}

function LangTable() {
	const [dataSource, setDataSource] = useState([])
	const [renderData, setRenderData] = useState([])
	const [textareaValue, setTextareaValue] = useState('')
	const [addKeyList, setAddKeyList] = useState([])
	const [selectValue, setSelectValue] = useState('更新')
	const tableRef = useRef()
	const [selectList, setSelectList] = useState([
		{
			value: '新增',
			label: '新增',
      key: '新增',
      disabled: false
		},
		{
			value: '更新',
			label: '更新',
      key: '更新'
		},
	])
	const [isFuzzySearch, setIsFuzzySearch] = useState(false)
	const [isChecked, setIsChecked] = useState(true)
	const [isValueSearch, setIsValueSearch] = useState(true)
	const [filterKeyValue, setFilterKeyValue] = useState('')
	const [editPlaceholder, setEditPlaceholder] = useState('key')
  const [projectList, setProjectList] = useState([])
  const [selectedProject, setSelectedProject] = useState('queen')
  const [curCurObjectLang, setCurCurObjectLang] = useState([])
  const [langKeysList, setLangKeysList] = useState([])
  const [updateAllLangLoading, setUpdateAllLangLoading] = useState(false)

	function filterValueIsEmpty() {
		let notEmptyKeys = []
		dataSource.forEach((item) => {
			Object.keys(item.data).forEach((key) => {
				if (item.data[key] === '----') {
					notEmptyKeys.push(key)
				}
			})
		})

		notEmptyKeys = [...new Set(notEmptyKeys)]

		const newData = dataSource.map((item) => {
			const newItem = {
				...item,
				data: {},
			}

			Object.keys(item.data).forEach((key) => {
				if (notEmptyKeys.includes(key)) {
					newItem.data[key] = item.data[key]
				}
			})

			return newItem
		})

		setRenderData(newData)
	}

	function filterKey(value) {
		if (!value) {
			alert(`请输入筛选的${isValueSearch ? '值' : 'key'}`)
			return
		}

		if (isValueSearch) {
			let values = value.trim().split(/,/)
			if (!isChecked) {
				values = [value]
			}

			let _keys = []
      const langLenMap = []
      dataSource.forEach((item) => {
        console.log('item.data', Object.keys(item.data).length)
        langLenMap.push({
          key: item.headName,
          len: Object.keys(item.data).length,
        })
      })

      const maxLen = Math.max(...langLenMap.map(item => item.len))
      const firstKey = langLenMap.find(item => item.len === maxLen).key
      const firstKeyData = dataSource.find(item => item.headName === firstKey).data
      const keys = Object.keys(firstKeyData)

      if (isFuzzySearch) {
        // values.forEach(v => {
        //   if (keys.some(k => k.includes(v))) {
        //     _keys.push(k)
        //   }
        // })
        for (let _kk = 0; _kk < keys.length; _kk++) {
          const k = keys[_kk]
          if (values.some(v => k.includes(v))) {
            _keys.push(k)
          }
        }
      } else {
        values.forEach(v => {
          if (keys.includes(v)) {
            _keys.push(v)
          }
        })
      }

			_keys = [...new Set(_keys)]

      console.log("🚀 ~ filterKey ~ dataSource: ", dataSource);

			const newData = dataSource.map((item) => {
				const newItem = {
					...item,
					data: {},
				}

				_keys.forEach((key) => {
					newItem.data[key] = item.data[key]
				})

				return newItem
			})

      console.log("🚀 ~ filterKey ~ newData: ", newData);

			setRenderData(newData)
		}
		else {
			let keys = value.trim().split(/,/)
			if (!isChecked) {
				keys = [value]
			}
			const newData = dataSource.map((item) => {
				const newItem = {
					...item,
					data: {},
				}

				Object.keys(item.data).forEach((k) => {
					// 模糊搜索
					if (isFuzzySearch) {
						if (keys.some(key => k.includes(key))) {
							newItem.data[k] = item.data[k]
						}
					}
					else {
						if (keys.includes(k)) {
							newItem.data[k] = item.data[k]
						}
					}
				})

				return newItem
			})
			setRenderData(newData)
		}
	}

	function copyJson(key) {
		const copyData = {}
		renderData.forEach((item) => {
			if (item.data[key]) {
				copyData[item.headName] = item.data[key]
			}
		})
		navigator.clipboard
		.writeText(JSON.stringify(copyData, null, 2))
		.then(() => {
			console.log('复制成功')
		})
		.catch((err) => {
			console.error('复制失败', err)
		})
	}

	async function init() {
    const [res, err] = await getGitList()
    if (!err) {
      setProjectList(res?.map(item => {
        return {
          value: item,
          label: item,
        }
      }))
    }
	}

  async function getLangData(name, langList) {
    const [res, err] = await getGitData({ name })
    if (!err) {

      const resData = res || {}
      const firstKey = Object.keys(resData)[0];
      if (firstKey) {
        const curKeys = Object.keys(resData[firstKey])
        setLangKeysList(curKeys)
        const data = []

        curKeys.forEach((key) => {
          data.push({
            headName: key,
            data: getJsonKeyValues(resData, key),
          })
        })

        // 根据 langKeys 进行排序
        // data.sort((a, b) => {
        //   const indexA = langKeys.indexOf(a.headName)
        //   const indexB = langKeys.indexOf(b.headName)
        //   return indexA - indexB
        // })

        setDataSource(data)
      }
    }
  }

  async function updateAllLangHandle() {
    const json = {}
    const keys = Object.keys(renderData[0]?.data || {})
    keys.forEach((key) => {
      json[key] = {}
    })

    if (keys.length) {
      keys.forEach((key) => {
        renderData.forEach((item) => {
          if (item.data[key]) {
            json[key][item.headName] = item.data[key]
          }
        })
      })
    }


    const values = Object.values(json)

    for (let i = 0; i < values.length; i++) {
      const v = Object.values(values[i])
      if (v.includes('----')) {
        message.error('完善信息')
        return
      }
    }

    setUpdateAllLangLoading(true)
    const [res, err] = await updateAllLang({
      data: json,
      projectName: selectedProject,
    })
    setUpdateAllLangLoading(false)
    if (err) {
      return
    }

    message.success(res)
  }

	async function updateJson(key) {
		const copyData = {
			key,
      projectName: selectedProject,
		}
		renderData.forEach((item) => {
			if (item.data[key]) {
				copyData[item.headName] = item.data[key]
			}
		})

		if (Object.values(copyData).includes('----')) {
			message.error('请先填写翻译内容')
			return
		}


    const [res, err] = await updateLang(copyData)
    if (err) {
      return
    }

    message.success(res)

		// fetch('/lang-api/update-lang', {
		// 	method: 'POST',
		// 	headers: {
		// 		'Content-Type': 'application/json',
		// 	},
		// 	body: JSON.stringify(copyData),
		// })
		// .then(async (res) => {
		// 	const r = await res.json()
		// 	if (r.code === 0) {
		// 		alert('更新成功')
    //     getLangData(selectedProject)
		// 	}
		// })
		// .then(data => console.log(data))
	}

	async function parseData() {
		if (!textareaValue) {
			message.error('请输入数据')
			return
		}
		const copyList = await transCopyTextTo2Array(textareaValue)

		if (copyList.length === 0) {
      message.error('表格数据为空')
			return
		}

		let dataList = []
		const keyNames = copyList.map(item => item[0])
		console.log('🚀 ~ addLang ~ keyNames: ', keyNames)
		const data = []
    langKeysList.forEach((key) => {
      data.push({
        headName: key,
        data: {},
      })
    })
		// 根据 langKeys 进行排序
		// data.sort((a, b) => {
		// 	const indexA = langKeys.indexOf(a.headName)
		// 	const indexB = langKeys.indexOf(b.headName)
		// 	return indexA - indexB
		// })
		dataList = JSON.parse(JSON.stringify(data))

		// 只传入key的情况
		const names = []
		keyNames.forEach((_name) => {
			dataList.forEach((item) => {
				// 将item 转化成map，避免顺序问题
				const map = new Map(Object.entries(item.data))
				map.set(_name, '----')
				names.push(_name)
				// 将map转化成对象
				const newData = Object.fromEntries(map)
				item.data = newData
			})
		})

		// setRenderData(dataList);

		dataList.forEach((item) => {
			const headName = item.headName
			const data = item.data

			for (let i = 0; i < copyList.length; i++) {
				for (let j = 1; j < copyList[i].length; j++) {
					const key = copyList[i][0]
					const value = copyList[i][j]

					if (headName === langKeys[j - 1]) {
						data[key] = value || '----'
					}
				}
			}
		})
		console.log('🚀 ~ addLang ~ dataList: ', dataList)

		setAddKeyList(names)
		setRenderData(dataList)
	}

	async function addLang() {
		if (!textareaValue) {
      message.error('请输入表格数据')
			return
		}

		// 如果数据中存在 ----，提示用户
		if (renderData.some(item => Object.values(item.data).includes('----'))) {
			const table = tableRef.current
			const divAll = table.querySelectorAll('tbody tr td div[data-key]')

			for (let i = 0; i < divAll.length; i++) {
				if (divAll[i].textContent === '----') {
					divAll[i].scrollIntoView({
						behavior: 'smooth',
						block: 'center',
					})

					divAll[i].classList.add(css.tableAnimation)

					setTimeout(() => {
						divAll[i].classList.remove(css.tableAnimation)
					}, 3000)
					break
				}
			}

			return
		}

    console.log('renderDatarenderData', renderData)

    addLangApi({
      data: renderData,
      projectName: selectedProject,
    })
		// JSON.stringify(renderData)
		// fetch('/lang-api/add-lang', {
		// 	method: 'POST',
		// 	headers: {
		// 		'Content-Type': 'application/json',
		// 	},
		// 	body: JSON.stringify(renderData),
		// })
		// .then(async (res) => {
		// 	const r = await res.json()
		// 	if (r.code === 0) {
		// 		alert('新增成功')
		// 		init()
		// 	}
		// 	else {
		// 		alert(r.msg)
		// 	}
		// })
		// .then(data => console.log(data))
	}

	async function allJsonToLangFile() {}

  async function getGitLasUpdate() {
    const [res, err] = await getGitPull()
    if (err) {
      return
    }

    message.success(res)
  }

	useEffect(() => {
		init()
	}, [])

	useEffect(() => {
		setEditPlaceholder(
			isValueSearch ? '值' : 'key',
		)
	}, [isValueSearch])

  useEffect(() => {
    getLangData(selectedProject)
  }, [selectedProject])

	return (
		<div className={css.tableContainer}>
      <Select
        options={projectList}
        className="w-50"
        defaultValue={selectedProject}
        onChange={(value) => {
          setSelectedProject(value)
        }}
      />
      <br />
      <Button className="mt-[15px] mr-[15px]" type="primary" onClick={() => getGitLasUpdate()}>拉取{selectedProject}最新多语言</Button>
      <Button title="之前项目的pnpm updateLang" className="mt-[15px]" type="primary" onClick={async () => {
        const [res, err] =await getUpdateLocalFile({
          projectName: selectedProject,
        })
        if (err) {
          return
        }

        message.success(res)

      }}>更新{selectedProject}本地多语言文件</Button>
      <Tabs defaultActiveKey="更新" items={selectList} onChange={(val) => {
          console.log("🚀 ~  ~ val: ", val);
        setSelectValue(val)
      }} />

      {selectValue === '新增' &&(
        <div>
          把  <a href="https://docs.google.com/spreadsheets/d/19d8VD3111cvpvxWRd-7gnXv5XBgOVqUE5dZGgo7YgVQ/edit?usp=sharing" target="_blank">多语言</a> 的数据直接复制到文档中，解析，添加
        </div>
      )}

			<br />

			{selectValue === '更新'
				? (
					<div>
						{/*<button*/}
						{/*	className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium text-[20px] rounded-[28px] px-[20px] py-2.5 me-2 mb-[10px] dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"*/}
						{/*	onClick={filterValueIsEmpty}>*/}
						{/*	筛选没有翻译的*/}
						{/*</button>*/}
						<div className={css.updateOper}>
                <textarea
									className="block rounded-[10px] min-h-[200px] p-2.5 w-full text-[20px] text-gray-900 bg-gray-50  border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
	                placeholder={`输入${editPlaceholder}筛选，多个通过","分割`}
	                value={filterKeyValue}
	                onChange={(e) => {
		                setFilterKeyValue(e.target.value)
	                }}
                />
							<div className={css.right}>
								<label className={css.oper}>
									<input
										className="w-[20px] h-[20px] text-blue-600 bg-gray-100 border-gray-300 rounded-[20px] focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
										type="checkbox"
										checked={isValueSearch}
										onChange={(e) => {
											setIsValueSearch(e.target.checked)
										}}
									/>
									<span
										className="ms-2 text-[14px] font-medium text-gray-900 dark:text-gray-300"
									>用值搜索(Search by value)</span>
								</label>
								<label className={css.oper}>
									<input
										className="w-[20px] h-[20px] text-blue-600 bg-gray-100 border-gray-300 rounded-[20px] focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
										type="checkbox"
										checked={isChecked}
										onChange={(e) => {
											setIsChecked(e.target.checked)
										}}
									/>
									<span
										className="ms-2 text-[14px] font-medium text-gray-900 dark:text-gray-300"
									>逗号分隔(comma separated)</span>
								</label>
								<label className={css.oper}>
									<input
										className="w-[20px] h-[20px] text-blue-600 bg-gray-100 border-gray-300 rounded-[20px] focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
										type="checkbox"
										checked={isFuzzySearch}
										onChange={(e) => {
											setIsFuzzySearch(e.target.checked)
										}}
									/>
									<span
										className="ms-2 text-[14px] font-medium text-gray-900 dark:text-gray-300"
									>模糊搜索(fuzzy search)</span>
								</label>
								<Button
                  type="primary"
									onClick={() => {
										filterKey(filterKeyValue)
									}}
								>
									筛选
								</Button>

                <Button
                  loading={updateAllLangLoading}
                  type="primary"
                  disabled={renderData.length === 0}
                  onClick={() => {
                    updateAllLangHandle()
                  }}
                >
                  更新所有
                </Button>
							</div>
						</div>
					</div>
				)
				: (
					<div className={css.updateOper}>
              <textarea
								className="block rounded-[10px] min-h-[200px] p-2.5 w-full text-[20px] text-gray-900 bg-gray-50  border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
	              placeholder="复制的表格数据，第一列默认为key，可以直接粘贴进来"
	              value={textareaValue}
	              onChange={(e) => {
		              setTextareaValue(e.target.value)
	              }}
              />
						<div className={css.right}>
							<button
								onClick={parseData}
								type="button"
								className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium text-[20px] rounded-[28px] px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
							>解析</button>
							<button
								onClick={addLang}
								type="button"
								className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium text-[20px] rounded-[28px] px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
							>新增</button>
						</div>
					</div>
				)}

			{renderData.length !== 0 && (
				<table className={css.table} border="1" ref={tableRef}>
					<thead>
					<tr>
						<th>Key</th>
						{renderData.map((item) => {
							return <th key={item.headName}>{item.headName}</th>
						})}
						<th>操作</th>
					</tr>
					</thead>
					<tbody>
					{renderData[0]
						&& Object.keys(renderData[0].data).map((key) => {
							return (
								<tr key={key}>
									<td>{key}</td>
									{renderData.map((item) => {
										return (
											<td key={`${item.headName}-${key}`}>
												<div
													className={joinClass(css.tdDiv)}
													data-lang={item.headName}
													data-key={key}
													onClick={async (e) => {
														// 变成edit状态
														e.target.contentEditable = true
														e.target.focus()
													}}
													onBlur={(e) => {
														e.target.contentEditable = false
														const newData = [...renderData]
														const index = newData.findIndex(i => i.headName === item.headName)
														newData[index].data[key] = e.target.textContent
														setRenderData(newData)
													}}
												>
													{item.data[key]}
												</div>
											</td>
										)
									})}
									<td>
										{addKeyList.includes(key)
											? (
												<>-</>
											)
											: (
												<Button
                          type="dashed"
													onClick={() => {
														updateJson(key)
													}}
												>
													更新
												</Button>
											)}
									</td>
								</tr>
							)
						})}
					</tbody>
				</table>
			)}
		</div>
	)
}

export default LangTable
