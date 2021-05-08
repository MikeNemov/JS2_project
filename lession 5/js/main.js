// 'use strict';
//
// const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';
//
// // Переделать в ДЗ не использовать fetch а Promise
// let getRequest = (url, cb) => {
//     let xhr = new XMLHttpRequest();
//     xhr.open('GET', url, true);
//     xhr.onreadystatechange = () => {
//         if (xhr.readyState === 4) {
//             if (xhr.status !== 200) {
//                 console.log('Error');
//             } else {
//                 cb(xhr.responseText);
//             }
//         }
//     };
//     xhr.send();
// };
//
// // –--------------------------------
//
//
//
// class ProductList {
//     constructor(container = '.products') {
//         this.container = container;
//         this._goods = [];
//         this._allProducts = [];
//         this._getProducts()
//             .then((data) => {
//                 this._goods = data;
//                 this._render();
//             });
//     }
//
//
//     _getProducts() {
//         return fetch(`${API}/catalogData.json`)
//             .then((response) => response.json())
//             .catch((error) => {
//                 console.log(error);
//             });
//     }
//
//     _render() {
//         const block = document.querySelector(this.container);
//
//         for (const good of this._goods) {
//             const productObject = new ProductItem(good);
//             // console.log(productObject);
//             this._allProducts.push(productObject);
//             block.insertAdjacentHTML('afterbegin', productObject.render());
//         }
//     }
// }
//
// class ProductItem {
//     constructor(product, img = 'https://via.placeholder.com/200x150') {
//         this.product_name = product.product_name;
//         this.price = product.price;
//         this.id_product = product.id_product;
//         this.img = img;
//     }
//
//     render() {
//         return `<div class="product-item" data-id="${this.id_product}">
//                       <img src="${this.img}" alt="Some img">
//                       <div class="desc">
//                           <h3>${this.product_name}</h3>
//                           <p>${this.price} \u20bd</p>
//                           <button class="buy-btn">Купить</button>
//                       </div>
//                   </div>`;
//     }
// }
//
//
// const pl = new ProductList();


const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

const app = new Vue({
    el: '#app',
    data: {
        catalogUrl: '/catalogData.json',
        products: [],
        imgCatalog: 'https://via.placeholder.com/200x150'
    },
    methods: {
        getJson(url){
            return fetch(url)
                .then(result => result.json())
                .catch(error => {
                    console.log(error);
                })
        },
        addProduct(product){
            console.log(product.id_product);
        }
    },
    beforeCreate() {},
    created() {
        this.getJson(`${API + this.catalogUrl}`)
            .then(data => {
                for(let el of data){
                    this.products.push(el);
                }
            });
    },
    beforeMount() {},
    mounted(){},
    beforeUpdate() {},
    updated() {},
    beforeDestroy() {},
    destroyed() {},
});