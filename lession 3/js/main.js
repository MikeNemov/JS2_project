'use strict';

const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

// Переделать в ДЗ не использовать fetch а Promise
let getRequest = (url, cb) => {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            if (xhr.status !== 200) {
                console.log('Error');
            } else {
                cb(xhr.responseText);
            }
        }
    };
    xhr.send();
};

// Используя Promice
// let getRequest = (url) => {
//     return new Promise((resolve, reject) =>{
//         const xhr = new XMLHttpRequest();
//         xhr.open('GET', url, true);
//         xhr.onreadystatechange = () => {
//             if (this.readyState === 4) {
//                 if (this.status !== 200) {
//                     reject('Error');
//                 } else {
//                     resolve(xhr.responseText);
//                 }
//             }
//         }
//         xhr.send();
//
//         })
// }


class ProductList {
    constructor(cart,container = '.products') {
        this.container = container;
        this._goods = [];
        this._allProducts = [];
        this.cart = cart;
        this._init();



        this._getProducts()
            .then((data) => {
                this._goods = data;
                this._render();
            });
    }

    _init() {
        document.querySelector(this.container).addEventListener('click', e => {
            if (e.target.classList.contains('buy-btn')) {
                this.cart.addProduct(e.target);
            }
        });
    }

    _getProducts() {
        return fetch(`${API}/catalogData.json`)
            .then((response) => response.json())
            .catch((error) => {
                console.log(error);
            });
    }

    _render() {
        const block = document.querySelector(this.container);

        for (const good of this._goods) {
            const productObject = new ProductItem(good);
            this._allProducts.push(productObject);
            block.insertAdjacentHTML('afterbegin', productObject.render());
        }
    }
}

class ProductItem {
    constructor(product, img = 'https://via.placeholder.com/200x150') {
        this.product_name = product.product_name;
        this.price = product.price;
        this.id_product = product.id_product;
        this.img = img;
    }

    render() {
        return `<div class="product-item" data-id="${this.id_product}">
                <img src="${this.img}" alt="Some img">
                <div class="desc">
                    <h3>${this.product_name}</h3>
                    <p>${this.price} ₽</p>
                    <button class="buy-btn"
                      data-id="${this.id_product}"
                      data-name="${this.product_name}"
                      data-price="${this.price}">Купить</button>
                </div>
            </div>`;
    }
}

class Cart{
    constructor(container = '.cart') {
        this.container = container;
        this._goods = [];
        this._allProducts = [];
        this._init();

        this._getCart()
            .then((data) => {
                this._goods = data.contents;
                this._render();
            });
        }

    _getCart() {
        return fetch(`${API}/getBasket.json`)
            .then((response) => response.json())
            .catch((error) => {
                console.log(error);
            });
    }


    _render() {
        const cartBlock = document.querySelector(this.container);

        for (const good of this._goods) {
            const cartObject = new CartItem(good);
            this._allProducts.push(cartObject);
            cartBlock.insertAdjacentHTML('afterbegin', cartObject.render());
        }
    }

    addProduct(element){
        return fetch(`${API}/addToBasket.json`)
            .then((response) => response.json())
            .then(data => {
                if(data.result === 1){
                    let productId = +element.dataset['id'];
                    console.log(productId)
                    let find = this._allProducts.find(product => product.id_product === productId);
                    if(find){
                        find.quantity++;
                        this._updateCart(find);
                    } else {
                        console.log("notfind")
                        let product = {
                            id_product: productId,
                            price: +element.dataset['price'],
                            product_name: element.dataset['name'],
                            quantity: 1
                        };
                        this._goods = [product];
                        this._render();
                    }
                } else {
                    alert('Error');
                }
            })
    }


    removeProduct(element){
        return fetch(`${API}/deleteFromBasket.json`)
            .then((response) => response.json())
            .then(data => {
                if(data.result === 1){
                    let productId = +element.dataset['id'];
                    let find = this._allProducts.find(product => product.id_product === productId);
                    if(find.quantity > 1){
                        find.quantity--;
                        this._updateCart(find);
                    } else {
                        this._allProducts.splice(this._allProducts.indexOf(find), 1);
                        document.querySelector(`.cart-item[data-id="${productId}"]`).remove();
                    }
                } else {
                    alert('Error');
                }
            })
    }

    _updateCart(product){
        let block = document.querySelector(`.cart-item[data-id="${product.id_product}"]`);
        block.querySelector('.product-quantity').textContent = `Количество: ${product.quantity}`;
        block.querySelector('.product-price').textContent = `${product.quantity * product.price} ₽`;
    }

    _init(){
        document.querySelector('.btn-cart').addEventListener('click', () => {
            document.querySelector(this.container).classList.toggle('disable');
        });
        document.querySelector(this.container).addEventListener('click', e => {
            if(e.target.classList.contains('del-btn')){
                this.removeProduct(e.target);
            }
        })
    }
}

class CartItem extends ProductItem {
    constructor(product, img) {
        super(product,img);
        this.quantity = product.quantity;
    }

    render() {
        return `<div class="cart-item" data-id="${this.id_product}">
                <div class="product-bio">
                <img src="${this.img}" alt="Some image">
                <div class="product-desc">
                <p class="product-title">${this.product_name}</p>
                <p class="product-quantity">Количество: ${this.quantity}</p>
            <p class="product-single-price">Цена:${this.price}</p>
            </div>
            </div>
            <div class="right-block">
                <p class="product-price">${this.quantity * this.price} ₽</p>
                <button class="del-btn" data-id="${this.id_product}">&#215;</button>
            </div>
            </div>`
            ;}
}

new ProductList(new Cart());


