let eventBus = new Vue()

Vue.component('component', {
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
    methods:{
        localSaveFirstColumn(){
            localStorage.setItem('column_1', JSON.stringify(this.column_1));
        },
        localSaveSecondColumn(){
            localStorage.setItem('column_2', JSON.stringify(this.column_2));
        },
        localSaveThirdColumn(){
            localStorage.setItem('column_3', JSON.stringify(this.column_3));
        },
    },
    mounted() {
        this.column_1 = JSON.parse(localStorage.getItem('column_1')) || [];
        this.column_2 = JSON.parse(localStorage.getItem('column_2')) || [];
        this.column_3 = JSON.parse(localStorage.getItem('column_3')) || [];

        eventBus.$on('addColumn_1', ColumnCard => {

            if (this.column_1.length < 3) {
                this.errors.length = 0
                this.column_1.push(ColumnCard)
                this.localSaveFirstColumn()
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
                this.localSaveSecondColumn();
            } else {
                this.errors.length = 0
                this.errors.push()
            }
        })
        eventBus.$on('addColumn_3', ColumnCard => {
            this.column_3.push(ColumnCard)
            this.column_2.splice(this.column_2.indexOf(ColumnCard), 1)
            this.localSaveThirdColumn();

        })
    },
    watch: {
        column_1(newValue) {
            localStorage.setItem("column_1", JSON.stringify(newValue));
        },
        column_2(newValue) {
            localStorage.setItem("column_2", JSON.stringify(newValue));
        },
        column_3(newValue) {
            localStorage.setItem("column_3", JSON.stringify(newValue));
        }
    },

})

Vue.component('newCard', {
    template: `
    <section id="main" class="main-alt">

        <form @submit.prevent="Submit">

        <div class="text">
            <h2>Запишите что нибудь</h2>
        </div>

        <div class="form_control">

            <div class="form_name">
                <input required type="text" v-model="name" id="name" placeholder="Введите название заметки"/>
            </div>

            <input required type="text"  v-model="point_1" placeholder="Первый"/>
            <br>
            <input required type="text"  v-model="point_2" placeholder="Второй"/>
            <br>
            <input required type="text"  v-model="point_3" placeholder="Третий"/>
            <br>
            <input  type="text"  v-model="point_4"  placeholder="Четвертый"/>
            <br>
             <input type="text" v-model="point_5"  placeholder="Пятый"/>
        </div>
            <div class="form_control">
                <button class="btn">Отправьте что нибудь</button>
            </div>
        </form>
    </section>
    `,
    data() {
        return {
            name: null,
            point_1: null,
            point_2: null,
            point_3: null,
            point_4: null,
            point_5: null,
            date: null,
        }
    },
    methods: {

        Submit() {
            let card = {
                name: this.name,
                points: [
                    {name: this.point_1, completed: false},
                    {name: this.point_2, completed: false},
                    {name: this.point_3, completed: false},
                    {name: this.point_4, completed: false},
                    {name: this.point_5, completed: false}
                ],
                date: null,
                status: 0,
                errors: [],
            }
            eventBus.$emit('addColumn_1', card)
            this.name = null;
            this.point_1 = null
            this.point_2 = null
            this.point_3 = null
            this.point_4 = null
            this.point_5 = null
        }
    }

})

Vue.component('column_1', {
    template: `
        <section id="main" class="main-alt">
            <div class="column 1">
            <p>Начало</p>

                <div v-for="card in column_1">
                <h3>{{ card.name }}</h3>
                    <ul class="tasks" v-for="task in card.points"
                        v-if="task.name != null"
                        @click="TaskCompleted(card, task)"
                        :class="{completed: task.completed}">
                        <p>
                        {{ task.name }}
                        </p>
                    </ul>
                    <li v-if="tab.editButton === true">
                            <form @submit.prevent="updateTab(tab)">
                                <label for="title">Новый заголовок</label>
                                <input id="title" type="text" v-model="tab.title" maxlength="30" placeholder="Заголовок">
                                <label for="description">Новое описание:</label> 
                                <textarea id="description" v-model="tab.description" cols="20" rows="5"></textarea>
                                <input type="submit" value="Редактировать">
                            </form>                      
                        </li>
                </div>
            </div>
        </section>
    `,
    props: {
        column_1: {
            type: Array,
        },
        column_2: {
            type: Array,
        },
        card: {
            type: Object,
        },
        errors: {
            type: Array,
        },
    },
    methods: {
        TaskCompleted(ColumnCard, task) {
            if (task.completed === false){
                task.completed = true
                ColumnCard.status += 1
            }
            let count = 0
            for(let i = 0; i < 5; i++){
                if(ColumnCard.points[i].name !== null){
                    count++
                }
            }
            if ((ColumnCard.status / count) * 100 >= 50) {
                eventBus.$emit('addColumn_2', ColumnCard)
                this.column_1.splice(this.column_1.indexOf(ColumnCard), 0)
            }
        },
    },
})

Vue.component('column_2', {
    template: `
        <section id="main" class="main-alt">
            <div class="column 2">
            <p>Ваш прогресс</p>

                <div v-for="card in column_2">
                <h3>{{ card.name }}</h3>
                    <ul class="tasks" v-for="task in card.points"
                        v-if="task.name != null"
                        @click="TaskCompleted(card, task)"
                        :class="{completed: task.completed}">
                        <p>
                        {{ task.name }}
                        </p>
                    </ul>
                </div>
            </div>
        </section>
    `,
    props: {
        column_2: {
            type: Array,
        },
        card: {
            type: Object,
        },
    },
    methods: {
        TaskCompleted(ColumnCard, task) {
            if(task.completed === false){
                task.completed = true
                ColumnCard.status += 1
            }
            let count = 0
            for(let i = 0; i < 5; i++) {
                if (ColumnCard.points[i].name !== null) {
                    count++
                }
            }
            if (( ColumnCard.status / count) * 100 >= 100 ) {
                eventBus.$emit('addColumn_3', ColumnCard)
                ColumnCard.date = new Date().toLocaleString()


            }
        }
    }
})

Vue.component('column_3', {
    template: `
        <section id="main" class="main-alt">
            <div class="column 3">
            <p>Завершено</p>
                <div v-for="card in column_3">
                <h3>{{ card.name }}</h3>
                    <ul class="tasks" v-for="task in card.points"
                        v-if="task.name != null"
                        @click="TaskCompleted(card, task)"
                        :class="{completed: task.completed}">
                        <li>
                        {{ task.name }}
                        </li>
                    </ul><br>

                        <p>{{ card.date }}</p>
                </div>
            </div>
        </section>
    `,
    props: {
        column_3: {
            type: Array,
        },
        card: {
            type: Object,
        },
    }
})


let app = new Vue({
    el: '#app',
})
