// import './style.css'
import './demo.css'
import { DynamicList } from './packages/elements'

import '@mini-element/elements'

import "./scripts/components/form-debug"
import "./scripts/components/user-card"
import "./scripts/components/counter-elem"
import "./scripts/components/another-counter"
import "./scripts/components/reactive-test"

import './scripts/components/mini-test'

type Item = {
    id: string
    name: string
    age: number
    email: string
    color?: {
        id: string
        name: string
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const reactiveForm = document.querySelector('reactive-form') as HTMLFormElement
    reactiveForm.addEventListener('submit', () => {
        const data = reactiveForm.getFormData()
        // console.log("DATA", data)
        console.log(JSON.stringify(data, null, 2))
    })
})

document.addEventListener('DOMContentLoaded', () => {
    const sortButton = document.getElementById('sort')
    const list = document.querySelector('dynamic-list') as DynamicList<Item>
    let dataList: Item[] = [
        {
            id: '1',
            name: 'John Doe',
            age: 30,
            email: 'john@gmail.com',
            color: {
                id: 'one',
                name: 'Red'
            }
        },
        {
            id: '2',
            name: 'Jane Smith',
            age: 25,
            email: 'jane@gmail.com',
            color: {
                id: 'one',
                name: 'Red'
            }
        },
        {
            id: '3',
            name: 'Alice Johnson',
            age: 28,
            email: 'alice@gmail.com',
            color: {
                id: 'two',
                name: 'Blue'
            }
        },
        {
            id: '4',
            name: 'Bob Brown',
            age: 35,
            email: 'bob@gmail.com',
            color: {
                id: 'three',
                name: 'Green'
            }
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

    sortButton?.addEventListener('click', () => {
        if (list.hasAttribute('sortable')) {
            list.removeAttribute('sortable')
        } else {
            list.setAttribute('sortable', '')
        }
    })
})