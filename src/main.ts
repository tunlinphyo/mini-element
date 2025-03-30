import './style.css'
import { DynamicList } from './packages/elements'
import { Item } from './scripts/components/user-card'

import './packages/elements'
import "./scripts/components/form-debug"
import "./scripts/components/user-card"

document.addEventListener('DOMContentLoaded', () => {
    const list = document.querySelector('dynamic-list') as DynamicList<Item>
    let dataList: Item[] = [
        {
            id: '1',
            name: 'John Doe',
            age: 30,
            email: 'john@gmail.com'
        },
        {
            id: '2',
            name: 'Jane Smith',
            age: 25,
            email: 'jane@gmail.com'
        },
        {
            id: '3',
            name: 'Alice Johnson',
            age: 28,
            email: 'alice@gmail.com'
        },
        {
            id: '4',
            name: 'Bob Brown',
            age: 35,
            email: 'bob@gmail.com'
        }
    ]
    dataList = dataList.sort((a, b) => a.age - b.age)
    list.list = dataList

    const reactiveForm = document.querySelector('#form1') as HTMLFormElement
    reactiveForm.addEventListener('submit', () => {
        if (!reactiveForm.getAttribute('dirty')) {
            return reactiveForm.clear()
        }
        const data = reactiveForm.getFormData()
        console.log("DATA", data)
        if (data.id) {
            dataList = dataList.map(item => item.id === data.id ? { ...item, ...data } : item)
                                .sort((a, b) => a.age - b.age)
            list.list = dataList
        } else {
            dataList.push({...data, id: Date.now().toString() })
            dataList = dataList.sort((a, b) => a.age - b.age)
            list.list = dataList
        }
        console.log('Form submitted:', data, dataList)
        reactiveForm.clear()
    })

    list.addEventListener('item-click', (e: Event) => {
        const detail = (e as CustomEvent).detail
        if (detail) {
            if (detail.dataset.button === 'delete') {
                const id = confirm('Are you sure you want to delete this item?')
                if (!id) return
                dataList.splice(dataList.findIndex(item => item.id === detail.id), 1)
                list.list = dataList
            } else if (detail.dataset.button === 'edit') {
                const item = dataList.find(item => item.id === detail.id)
                if (item) {
                    reactiveForm.setFormData(item)
                }
            }
            console.log('Item clicked:', detail)
        }
    })
})

function shuffleArray<T>(array: T[]): T[] {
    const result = [...array]; // Copy to avoid mutating the original array
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]]; // Swap
    }
    return result;
}