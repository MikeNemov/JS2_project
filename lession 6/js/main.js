const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

const app = new Vue({
    el: '#app',
    data: {
        isVisibleCart: false,
        catalogUrl: '/catalogData.json',
        cartUrl: '/getBasket.json',
        addToCart: '/addToBasket.json',
        removeFromCart: '/deleteFromBasket.json',
        products: [],
        filtered: [],
        cartProducts: [],
        imgCatalog: 'https://via.placeholder.com/200x150',
        imgCart: 'https://via.placeholder.com/85x50',
        searchLine: '',
    },
    methods: {
        getJson(url){
            return fetch(url)
                .then(result => result.json())
                .catch(error => {
                    console.log(error);
                })
        },
        addProduct(product) {
            this.getJson(`${API + this.addToCart}`)
                .then(data => {
                    if (data.result === 1) {
                        let find = this.cartProducts.find(el => el.id_product === product.id_product);
                        if (find) {
                            find.quantity++;
                        } else {
                            let item = Object.assign({quantity: 1}, product);
                            this.cartProducts.push(item)
                        }
                    } else {
                        alert('Error');
                    }
                })
        },
        remove(item) {
            this.getJson(`${API + this.removeFromCart}`)
                .then(data => {
                    if (data.result === 1) {
                        if (item.quantity > 1) {
                            item.quantity--;
                        } else {
                            this.cartProducts.splice(this.cartProducts.indexOf(item), 1)
                        }
                    }
                })
        },

        filterGoods(){
            let regexp = new RegExp(this.searchLine, 'i');
            this.filtered = this.products.filter(el => regexp.test(el.product_name));
        },

    },



    beforeCreate() {},
    created() {
        this.getJson(`${API + this.cartUrl}`)
            .then(data => {
                for (let el of data.contents) {
                    this.cartProducts.push(el);
                }
            });

        this.getJson(`${API + this.catalogUrl}`)
            .then(data => {
                for(let el of data){
                    this.products.push(el);
                    this.filtered.push(el);
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