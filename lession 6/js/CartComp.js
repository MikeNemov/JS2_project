Vue.component('cart', {
    data(){
        return {
            imgCart: 'https://via.placeholder.com/85x50',
            cartUrl: '/getBasket.json',
            addToCart: '/addToBasket.json',
            removeFromCart: '/deleteFromBasket.json',
            cartProducts: [],
            isVisibleCart: false,
        }
    },
    methods: {
        addProduct(product) {
            this.$parent.getJson(`${API + this.addToCart}`)
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
            this.$parent.getJson(`${API + this.removeFromCart}`)
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
        mounted(){
        this.$parent.getJson(`${API + this.cartUrl}`)
            .then(data => {
                for(let el of data.contents){
                    this.cartProducts.push(el);
                }
            });
    },
    template: `
        <div>
            <button class="btn-cart" type="button" @click="isVisibleCart = !isVisibleCart">Корзина</button>
            <div class="cart-block" v-show="isVisibleCart">
                <p v-if="!cartProducts.length">Ой, корзина пуста</p>
                <cart-item class="cart-item" 
                v-for="item of cartProducts" 
                :key="item.id_product"
                :cart-item="item" 
                :img="imgCart"
                @remove="remove">
                </cart-item>
            </div>
        </div>`
});

Vue.component('cart-item', {
    props: ['cartItem', 'img'],
    template: `
                <div class="cart-item">
                    <div class="product-bio">
                        <img :src="img" alt="Some image">
                        <div class="product-desc">
                            <p class="product-title">{{cartItem.product_name}}</p>
                            <p class="product-quantity">Количество: {{cartItem.quantity}}</p>
                            <p class="product-single-price">{{cartItem.price}}₽ за единицу</p>
                        </div>
                    </div>
                    <div class="right-block">
                        <p class="product-price">{{cartItem.quantity*cartItem.price}}₽</p>
                        <button class="del-btn" @click="$emit('remove', cartItem)">&times;</button>
                    </div>
                </div>
    `
});
