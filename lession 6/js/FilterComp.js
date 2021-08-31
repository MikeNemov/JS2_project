Vue.component(`filter-form`, {
    data(){
        return {
            searchLine: ''
        }
    },

    template: `
    <form action="#" class="search-form" @submit.prevent="$parent.$refs.products.filterGoods(searchLine)">
                <input type="text" id="search-field" class="search-field" v-model="searchLine" >
                <button class="btn-search" type="submit">
                    <i class="fas fa-search"></i>
                </button>
            </form>
    `
});
