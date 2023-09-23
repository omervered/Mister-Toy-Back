import fs from 'fs'
import { utilService } from './util.service.js'

const toys = utilService.readJsonFile('data/toy.json')

export const toyService = {
    query,
    get,
    remove,
    save
}

function query(filterBy = {}) {
    let toysToDisplay = toys
    if (filterBy.search) {
        // console.log('filterBy from toy service:', filterBy)
        const regExp = new RegExp(filterBy.search, 'i')
        toysToDisplay = toys.filter(toy => regExp.test(toy.name))
        // console.log('toys after filter regexp:', toys)
    }
    if (filterBy.minPrice) {
        toysToDisplay = toys.filter(toy => toy.price >= filterBy.minPrice)
    }
    if (filterBy.maxPrice) {
        toysToDisplay = toys.filter(toy => toy.price <= filterBy.maxPrice)
    }
    if (filterBy.inStock === true) {
        toysToDisplay = toys.filter(toy => toy.inStock === true);
    } else if (filterBy.inStock === false) {
        toysToDisplay = toys.filter(toy => toy.inStock === false);
    }

    return Promise.resolve(toysToDisplay)
}

function get(toyId) {
    const toy = toys.find(toy => toy._id === toyId)
    if (!toy) return Promise.reject('Toy not found!')
    return Promise.resolve(toy)
}

function remove(toyId) {
    console.log('toyId:', toyId)
    console.log('toys:', toys)
    const idx = toys.findIndex(toy => toy._id === toyId)
    if (idx === -1) return Promise.reject('No Such Toy')
    // const toy = toys[idx]
    // if (toy.owner._id !== loggedinUser._id) return Promise.reject('Not your toy')
    toys.splice(idx, 1)
    return _saveToysToFile()

}

function save(toy) {
    if (toy._id) {
        const toyToUpdate = toys.find(currToy => currToy._id === toy._id)
        // if (toyToUpdate.owner._id !== loggedinUser._id) return Promise.reject('Not your toy')
        toyToUpdate.name = toy.name
        toyToUpdate.price = toy.price
    } else {
        toy._id = _makeId()
        // toy.owner = loggedinUser
        toys.push(toy)
    }

    return _saveToysToFile().then(() => toy)
    // return Promise.resolve(toy)
}

function _makeId(length = 5) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

function _saveToysToFile() {
    return new Promise((resolve, reject) => {

        const toysStr = JSON.stringify(toys, null, 4)
        fs.writeFile('data/toy.json', toysStr, (err) => {
            if (err) {
                return console.log(err);
            }
            console.log('The file was saved!');
            resolve()
        });
    })
}
