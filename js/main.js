let eventBus = new Vue()

Vue.component('component', {
    // колонки
    template: `
 
        <div class="columns">
            <newCard></newCard>
         
            <column_1 :column_1="column_1"></column_1>
            <column_2 :column_2="column_2"></column_2>
            <column_3 :column_3="column_3"></column_3>
        </div>
    `,

    data() {
        return {
            column_1: [],
            column_2: [],
            column_3: [],
            errors: [],
        }

    },
    mounted() {
        this.column_1 = JSON.parse(localStorage.getItem('column_1')) || [];
        this.column_2 = JSON.parse(localStorage.getItem('column_2')) || [];
        this.column_3 = JSON.parse(localStorage.getItem('column_3')) || [];
        eventBus.$on('addColumn_1', ColumnCard => {

            if (this.column_1.length < 3) {
                this.errors.length = 0
                this.column_1.push(ColumnCard)
                this.saveColumn_1();
            } else {
                this.errors.length = 0
                this.errors.push()
            }
        })
        eventBus.$on('addColumn_2', ColumnCard => {
            if (this.column_2.length < 5) {
                this.errors.length = 0
                this.column_2.push(ColumnCard)
                this.column_1.splice(this.column_1.indexOf(ColumnCard), 1)
                this.saveColumn_1();
                this.saveColumn_2();
            } else {
                this.errors.length = 0
                this.errors.push()
            }
        })
        eventBus.$on('addColumn_3', ColumnCard => {
            this.column_3.push(ColumnCard)
            this.column_2.splice(this.column_2.indexOf(ColumnCard), 1)
            this.saveColumn_2();
            this.saveColumn_3();

        })
    },

    methods: {
        saveColumn_1(){
            localStorage.setItem('column_1', JSON.stringify(this.column_1));
        },
        saveColumn_2(){
            localStorage.setItem('column_2', JSON.stringify(this.column_2));
        },
        saveColumn_3(){
            localStorage.setItem('column_3', JSON.stringify(this.column_3));
        }
    }
})



let app = new Vue({
    el: '#app',
})